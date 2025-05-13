from datetime import datetime
from pathlib import Path
import logging
import random
import re
import sqlite3
import time

import httpx

logging.getLogger("httpx").setLevel(logging.CRITICAL)


def extract_show_id(url):
    match = re.search(r"/id(\d+)", url)
    return match.group(1) if match else None


def scrape_shows(retry=False):
    status = "error" if retry else "pending"
    scraped_at = datetime.now().isoformat()

    ROOT_DIR = Path(__file__).resolve().parents[1]
    out_dir = ROOT_DIR / "shows"
    out_dir.mkdir(exist_ok=True)

    categories = [
        "news",
        "comedy",
        "society_and_culture",
        "business",
        "true_crime",
        "sports",
        "health_and_fitness",
        "religion_and_spirituality",
        "arts",
        "education",
        "history",
        "tv_and_film",
        "science",
        "technology",
        "music",
        "kids_and_family",
        "leisure",
        "fiction",
        "government",
    ]

    conn = sqlite3.connect("/home/ansel/dev/okapi-rank/podcasts.db")
    cursor = conn.cursor()

    for category in categories:
        out_path = out_dir / category
        out_path.mkdir(exist_ok=True)

    cursor.execute(
        """
        SELECT podcast.id, podcast.name, podcast.category, podcast.url, download.status
        FROM podcast
        JOIN download ON podcast.id = download.id
        LEFT JOIN frequency ON podcast.id = frequency.podcast_id
        WHERE download.status = ?
        OR (download.status = 'active' AND (frequency.next_scrape IS NULL OR frequency.next_scrape <= ?))
        """,
        (status, scraped_at),
    )

    results = cursor.fetchall()

    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 15.4.1) AppleWebKit/537.36 (KHTML, like Gecko) Safari/18.4"
    }

    total_podcasts = len(results)
    start_time = time.time()
    downloaded = 0

    with httpx.Client(headers=headers, timeout=10.0, follow_redirects=True) as client:
        for podcast_id, name, category, url, status in results:
            show_id = extract_show_id(url)
            filepath = out_dir / category / f"{show_id}.html"
            download_start_time = time.time()

            try:
                response = client.get(url)
                response.raise_for_status()

                if str(response.url) != url:
                    cursor.execute(
                        "UPDATE podcast SET url = ? WHERE id = ?",
                        (str(response.url), podcast_id),
                    )
                    conn.commit()

                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(response.text)

                cursor.execute(
                    """
                    INSERT OR REPLACE INTO download (id, status, scraped_at)
                    VALUES (?, ?, ?)
                    """,
                    (podcast_id, "active", scraped_at),
                )
                conn.commit()

                download_elapsed_time = time.time() - download_start_time
                downloaded += 1

                total_elapsed_time = time.time() - start_time
                avg_time_per_page = total_elapsed_time / downloaded
                remaining_pages = total_podcasts - downloaded
                eta = avg_time_per_page * remaining_pages

                hours, remainder = divmod(int(eta), 3600)
                minutes, seconds = divmod(remainder, 60)
                eta_formatted = f"{hours:02d}:{minutes:02d}:{seconds:02d}"

                print(
                    f"{url} {download_elapsed_time:.2f}s Remaining {remaining_pages} ETA {eta_formatted}"
                )

            except httpx.HTTPError as error:
                print(str(error))
                cursor.execute(
                    """
                    INSERT OR REPLACE INTO download (id, status, scraped_at)
                    VALUES (?, ?, ?)
                    """,
                    (podcast_id, "error", scraped_at),
                )
                conn.commit()

            time.sleep(0.6 + random.uniform(0, 0.2))

    conn.close()


if __name__ == "__main__":
    scrape_shows(retry=False)
