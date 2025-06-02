from dotenv import load_dotenv
from pathlib import Path
from urllib.parse import urlparse
import os
import sqlite3

import httpx
from transformers.pipelines import pipeline

from categories import CATEGORY_MAPPINGS

load_dotenv()
API_TOKEN = os.getenv("API_TOKEN")


def to_embed_url(url: str) -> str:
    """Convert Apple Podcasts URLs to embeddable URLs."""
    parsed = urlparse(url)
    if "podcasts.apple.com" in parsed.netloc:
        return f"https://embed.podcasts.apple.com{parsed.path}?{parsed.query}"
    return url


def generate_section_feeds(db_path: Path, categories: dict):

    classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    for section in categories.values():
        section_name = section.get("name")
        subcategories = section.get("subcategories")
        if subcategories:
            for subcat in subcategories.values():
                desc = subcat.get("desc")
                subcat_name = subcat.get("name")
                subcat_pairs = subcat.get("match_categories")
                placeholders = ",".join(["(?, ?)"] * len(subcat_pairs))
                query = f"""
                    SELECT
                        e.title,
                        p.subcategory,
                        e.release_date,
                        s.rank_score,
                        p.name AS podcast_name,
                        e.episode_url,
                        e.summary,
                        e.episode_image,
                        e.show_image,
                        e.duration
                    FROM episode e
                    JOIN 
                        podcast p ON e.podcast_id = p.id
                    LEFT JOIN (
                        SELECT s1.podcast_id, s1.rank_score
                        FROM score s1
                        JOIN (
                            SELECT podcast_id, MAX(date) AS max_date
                            FROM score
                            GROUP BY podcast_id
                        ) s2 ON s1.podcast_id = s2.podcast_id AND s1.date = s2.max_date
                    ) s ON p.id = s.podcast_id
                    WHERE
                        (p.category, p.subcategory) IN ({placeholders})
                        AND replace(substr(e.release_date, 1, 19), 'T', ' ') <= datetime('now')
                        AND CAST(e.duration AS INTEGER) > 600
                    ORDER BY 
                        replace(substr(e.release_date, 1, 19), 'T', ' ') DESC
                    LIMIT 1000;
                """

                params = [item for pair in subcat_pairs for item in pair]
                cursor.execute(query, params)
                results = cursor.fetchall()

                matching_episodes = []

                for result in results:
                    (
                        title,
                        subcategory,
                        release_date,
                        rank_score,
                        podcast_name,
                        url,
                        summary,
                        episode_image,
                        show_image,
                        duration,
                    ) = result
                    embed_url = to_embed_url(url)
                    image = episode_image or show_image
                    episode = {
                        "title": title,
                        "subcategory": subcategory,
                        "release_date": release_date,
                        "score": rank_score,
                        "podcast_name": podcast_name,
                        "url": url,
                        "summary": summary,
                        "image": image,
                        "embed_url": embed_url,
                        "duration": duration,
                        "tag": subcat_name,
                    }
                    if desc is None:
                        matching_episodes.append(episode)
                    else:
                        candidate_text = f"{title}. {summary}" if summary else title
                        classification = classifier(
                            candidate_text, candidate_labels=[desc], multi_label=False
                        )

                        score = classification["scores"][0]
                        if score > 0.9:
                            episode["label_score"] = score
                            matching_episodes.append(episode)

                print(subcat_name, len(matching_episodes))
                matching_episodes.sort(key=lambda ep: ep["release_date"], reverse=True)

                url = "https://cdn.anselbrandt.net/upload"
                headers = {"Content-Type": "application/json", "X-API-Token": API_TOKEN}
                payload = {
                    "filename": f"{section_name}/{subcat_name}.json",
                    "data": matching_episodes,
                }
                response = httpx.post(url, headers=headers, json=payload)
                print(response.text)

    conn.close()
