import os
import sqlite3
from pathlib import Path
from urllib.parse import urlparse

import httpx
from dotenv import load_dotenv

from constants import paths

load_dotenv()

API_TOKEN = os.getenv("API_TOKEN")
CDN_URL = os.getenv("CDN_URL")


def to_embed_url(url: str) -> str:
    parsed = urlparse(url)
    if "podcasts.apple.com" in parsed.netloc:
        return f"https://embed.podcasts.apple.com{parsed.path}?{parsed.query}"
    return url


def generate_search_index():
    conn = sqlite3.connect(paths.db_path)
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            e.title,
            p.name AS podcast_name,
            e.summary,
            e.episode_url,
            COALESCE(e.episode_image, e.show_image) AS image,
            e.duration,
            e.release_date,
            s.rank_score
        FROM episode e
        JOIN podcast p ON e.podcast_id = p.id
        LEFT JOIN (
            SELECT s1.podcast_id, s1.rank_score
            FROM score s1
            JOIN (
                SELECT podcast_id, MAX(date) AS max_date
                FROM score
                GROUP BY podcast_id
            ) s2 ON s1.podcast_id = s2.podcast_id AND s1.date = s2.max_date
        ) s ON p.id = s.podcast_id
        WHERE e.episode_url IS NOT NULL
          AND CAST(e.duration AS INTEGER) > 600
        GROUP BY e.episode_url
        ORDER BY replace(substr(e.release_date, 1, 19), 'T', ' ') DESC;
        """
    )
    results = cursor.fetchall()
    conn.close()

    episodes = []
    for title, podcast_name, summary, url, image, duration, release_date, score in results:
        summary_short = (summary or "")[:150]
        embed_url = to_embed_url(url)
        episodes.append(
            {
                "t": title or "",
                "p": podcast_name or "",
                "s": summary_short,
                "u": url,
                "e": embed_url,
                "i": image or "",
                "d": duration or "",
                "r": release_date or "",
                "sc": score or 0,
            }
        )

    print(f"Search index: {len(episodes)} episodes")

    url = f"{CDN_URL}/upload"
    headers = {"Content-Type": "application/json", "X-API-Token": API_TOKEN}
    payload = {"filename": "search/index.json", "data": episodes}
    response = httpx.post(url, headers=headers, json=payload, timeout=30)
    print(response.text)
