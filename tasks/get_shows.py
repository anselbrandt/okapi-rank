from datetime import datetime
from pathlib import Path
import logging
import re
import sqlite3

logging.getLogger("httpx").setLevel(logging.CRITICAL)


def extract_show_id(url):
    match = re.search(r"/id(\d+)", url)
    return match.group(1) if match else None


def get_shows(db_path: Path, retry=False):
    status = "error" if retry else "pending"
    scraped_at = datetime.now().isoformat()

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute(
        """
        WITH ranked_podcasts AS (
            SELECT 
                podcast.id, 
                podcast.name, 
                podcast.category, 
                podcast.url, 
                download.status,
                score.rank_score,
                ROW_NUMBER() OVER (PARTITION BY podcast.id ORDER BY score.rank_score DESC) AS rn
            FROM podcast
            JOIN download ON podcast.id = download.id
            LEFT JOIN frequency ON podcast.id = frequency.podcast_id
            LEFT JOIN score ON podcast.id = score.podcast_id
            WHERE download.status = ?
            OR (download.status = 'active' AND (frequency.next_scrape IS NULL OR frequency.next_scrape <= ?))
        )
        SELECT id, name, category, url, status
        FROM ranked_podcasts
        WHERE rn = 1
        ORDER BY rank_score DESC
        LIMIT 10000;
        """,
        (status, scraped_at),
    )

    results = cursor.fetchall()

    conn.close()

    return results


def group_results(results):
    grouped_results = {
        "news": [],
        "arts": [],
        "business": [],
        "comedy": [],
        "education": [],
        "fiction": [],
        "government": [],
        "health_and_fitness": [],
        "history": [],
        "kids_and_family": [],
        "leisure": [],
        "music": [],
        "religion_and_spirituality": [],
        "science": [],
        "society_and_culture": [],
        "sports": [],
        "technology": [],
        "true_crime": [],
        "tv_and_film": [],
    }

    for podcast_id, name, category, url, status in results:
        episode = (podcast_id, name, category, url, status)
        grouped_results[category].append(episode)
    return grouped_results
