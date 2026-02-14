from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timedelta
import os
import shutil
import sqlite3
import subprocess
import time

import httpx
from dotenv import load_dotenv

from constants import paths
from categories import BASE_INDEX
from tasks import (
    create_tables,
    generate_category_mappings,
    generate_section_feeds,
    generate_top_stories,
    get_shows,
    group_results,
    insert_downloads,
    insert_episodes,
    insert_podcasts,
    insert_scores,
    push_feeds,
)
from tasks.scrape_show import extract_show_id

load_dotenv()

VERCEL_DEPLOY_HOOK_URL = os.getenv("VERCEL_DEPLOY_HOOK_URL")

UPDATE_INTERVAL = 30

last_push_time = None


countries = [
    {"name": "Australia", "code": "au", "scrollDistance": 600},
    {"name": "Canada", "code": "ca", "scrollDistance": 2000},
    {"name": "Ireland", "code": "ie", "scrollDistance": 700},
    {"name": "New Zealand", "code": "nz", "scrollDistance": 600},
    {"name": "United Kingdom", "code": "gb", "scrollDistance": 1000},
    {"name": "United States", "code": "us", "scrollDistance": 2000},
]

categories = [
    {"name": "Arts", "genre": 1301, "filename": "arts"},
    {"name": "Business", "genre": 1321, "filename": "business"},
    {"name": "Comedy", "genre": 1303, "filename": "comedy"},
    {"name": "Education", "genre": 1304, "filename": "education"},
    {"name": "Fiction", "genre": 1483, "filename": "fiction"},
    {"name": "Government", "genre": 1511, "filename": "government"},
    {"name": "Health & Fitness", "genre": 1512, "filename": "health_and_fitness"},
    {"name": "History", "genre": 1487, "filename": "history"},
    {"name": "Kids & Family", "genre": 1305, "filename": "kids_and_family"},
    {"name": "Leisure", "genre": 1502, "filename": "leisure"},
    {"name": "Music", "genre": 1310, "filename": "music"},
    {"name": "News", "genre": 1489, "filename": "news"},
    {
        "name": "Religion & Spirituality",
        "genre": 1314,
        "filename": "religion_and_spirituality",
    },
    {"name": "Science", "genre": 1533, "filename": "science"},
    {"name": "Society & Culture", "genre": 1324, "filename": "society_and_culture"},
    {"name": "Sports", "genre": 1545, "filename": "sports"},
    {"name": "Technology", "genre": 1318, "filename": "technology"},
    {"name": "True Crime", "genre": 1488, "filename": "true_crime"},
    {"name": "TV & Film", "genre": 1309, "filename": "tv_and_film"},
]


def download_show(show):
    """Download a show page via HTTP. Returns (show, show_id, html, final_url) or (show, show_id, None, None) on error."""
    podcast_id, name, category, url, status = show
    show_id = extract_show_id(url)

    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 15.4.1) AppleWebKit/537.36 (KHTML, like Gecko) Safari/18.4"
    }

    try:
        with httpx.Client(headers=headers, timeout=10.0, follow_redirects=True) as client:
            response = client.get(url)
            response.raise_for_status()
            return (show, show_id, response.text, str(response.url))
    except httpx.HTTPError as error:
        print(str(error))
        return (show, show_id, None, None)


def process_category(category, shows):
    if not VERCEL_DEPLOY_HOOK_URL:
        raise ValueError("VERCEL_DEPLOY_HOOK_URL not found in .env")

    # Download all show pages in parallel
    download_results = []
    with ThreadPoolExecutor(max_workers=20) as executor:
        futures = {executor.submit(download_show, show): show for show in shows}
        for future in as_completed(futures):
            download_results.append(future.result())

    # Process DB writes sequentially
    scraped_at = datetime.now().isoformat()
    conn = sqlite3.connect(paths.db_path)
    cursor = conn.cursor()

    for show, show_id, html, final_url in download_results:
        podcast_id, name, cat, url, status = show
        if html is not None:
            if final_url != url:
                cursor.execute(
                    "UPDATE podcast SET url = ? WHERE id = ?",
                    (final_url, podcast_id),
                )
            cursor.execute(
                "INSERT OR REPLACE INTO download (id, status, scraped_at) VALUES (?, ?, ?)",
                (podcast_id, "active", scraped_at),
            )
            conn.commit()
            insert_episodes(db_path=paths.db_path, show_id=show_id, html=html)
            print(cat, name)
        else:
            cursor.execute(
                "INSERT OR REPLACE INTO download (id, status, scraped_at) VALUES (?, ?, ?)",
                (podcast_id, "error", scraped_at),
            )
            conn.commit()

    conn.close()

    insert_scores(db_path=paths.db_path)

    category_mappings = generate_category_mappings(
        db_path=paths.db_path, base_index=BASE_INDEX
    )
    filtered_mappings = {
        k: v
        for k, v in category_mappings.items()
        if k == category or (category == "news" and k == "latest")
    }
    generate_section_feeds(
        db_path=paths.db_path,
        categories=filtered_mappings,
    )
    generate_top_stories()

    _push_and_deploy()


def refresh_news_feeds():
    """Regenerate news/latest feeds from existing DB data without re-scraping."""
    if not VERCEL_DEPLOY_HOOK_URL:
        raise ValueError("VERCEL_DEPLOY_HOOK_URL not found in .env")

    insert_scores(db_path=paths.db_path)

    category_mappings = generate_category_mappings(
        db_path=paths.db_path, base_index=BASE_INDEX
    )
    filtered_mappings = {
        k: v
        for k, v in category_mappings.items()
        if k == "news" or k == "latest"
    }
    generate_section_feeds(
        db_path=paths.db_path,
        categories=filtered_mappings,
    )
    generate_top_stories()

    _push_and_deploy()


def _push_and_deploy():
    """Push feeds and trigger deploy if enough time has passed."""
    global last_push_time
    now = datetime.now()

    if not last_push_time or (now - last_push_time) > timedelta(
        minutes=UPDATE_INTERVAL
    ):
        is_pushed = push_feeds()
        if not is_pushed:
            max_retries = 3
            for attempt in range(1, max_retries + 1):
                try:
                    response = httpx.get(VERCEL_DEPLOY_HOOK_URL, timeout=30.0)
                    print(
                        f"Deploy hook response (attempt {attempt}): {response.status_code} {response.text}"
                    )
                    if response.status_code in (200, 201):
                        break
                except httpx.ReadTimeout:
                    print(f"ReadTimeout on attempt {attempt} to call deploy hook.")
                except httpx.RequestError as e:
                    print(f"RequestError on attempt {attempt}: {e}")
                if attempt < max_retries:
                    time.sleep(5)  # wait before retrying
        last_push_time = now


def update_feeds():
    while True:
        data_dir = paths.data_dir
        data_dir.mkdir(exist_ok=True)
        create_tables(db_path=paths.db_path)

        for country in countries:
            for category in categories:
                node_path = os.getenv("NODE_PATH") or shutil.which("node")
                script_path = os.path.join("scraper", "scrape_charts.js")
                commands = [
                    node_path,
                    script_path,
                    country["code"],
                    str(country["scrollDistance"]),
                    country["name"],
                    str(category["genre"]),
                ]
                try:
                    result = subprocess.run(
                        commands,
                        check=True,
                        text=True,
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE,
                    )
                    html = result.stdout
                    insert_podcasts(
                        db_path=paths.db_path,
                        country=country["code"],
                        category=category["filename"],
                        html=html,
                    )
                    print(country["code"], category["filename"])
                except subprocess.CalledProcessError as e:
                    error_message = f"Failed: https://podcasts.apple.com/{country['code']}/charts?genre={category['genre']}"
                    print(error_message, e.stderr)
                    continue
        insert_downloads(db_path=paths.db_path, status="pending")
        results = get_shows(db_path=paths.db_path)
        grouped = group_results(results)
        for i, (category, shows) in enumerate(grouped.items()):
            if i == 0:
                process_category("news", grouped.get("news", []))
            elif i % 4 == 0:
                refresh_news_feeds()
            if category != "news":
                process_category(category, shows)


if __name__ == "__main__":
    update_feeds()
