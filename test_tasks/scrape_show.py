from datetime import datetime
from pathlib import Path
import logging
import random
import re
import sqlite3
import time

import httpx

from storage import DataIO

logging.getLogger("httpx").setLevel(logging.CRITICAL)


def extract_show_id(url):
    match = re.search(r"/id(\d+)", url)
    return match.group(1) if match else None


def scrape_show(show, db_path: Path, retry=False):
    scraped_at = datetime.now().isoformat()

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 15.4.1) AppleWebKit/537.36 (KHTML, like Gecko) Safari/18.4"
    }

    with httpx.Client(headers=headers, timeout=10.0, follow_redirects=True) as client:
        podcast_id, name, category, url, status = show
        show_id = extract_show_id(url)

        try:
            response = client.get(url)
            response.raise_for_status()

            if str(response.url) != url:
                cursor.execute(
                    "UPDATE podcast SET url = ? WHERE id = ?",
                    (str(response.url), podcast_id),
                )
                conn.commit()

            cursor.execute(
                """
                INSERT OR REPLACE INTO download (id, status, scraped_at)
                VALUES (?, ?, ?)
                """,
                (podcast_id, "active", scraped_at),
            )
            conn.commit()
            conn.close()
            return (show_id, response.text)

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
            conn.close()
