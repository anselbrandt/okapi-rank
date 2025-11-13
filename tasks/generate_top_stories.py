from datetime import datetime, timezone
import os
from dotenv import load_dotenv

import httpx

load_dotenv()

API_TOKEN = os.getenv("API_TOKEN")
CDN_URL = os.getenv("CDN_URL")


def parse_date(date_str: str):
    try:
        dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)
    except Exception:
        return None


def generate_top_stories():
    target_files = [
        "news/news",
        "news/world",
        "news/europe",
        "news/news_commentary",
        "news/politics",
        "society_and_culture/society_and_culture",
        "arts/arts",
    ]

    top_stories_by_file = {}
    seen_urls = set()

    for name in target_files:
        url = f"https://cdn.anselbrandt.net/{name}.json"
        try:
            response = httpx.get(url, timeout=30.0)
            response.raise_for_status()
            data = response.json()
        except httpx.ConnectError as e:
            print(f"Network error fetching {url}: {e}")
            continue
        except httpx.HTTPStatusError as e:
            print(f"HTTP error fetching {url}: {e}")
            continue
        except Exception as e:
            print(f"Unexpected error fetching {url}: {e}")
            continue

        episodes = data

        filtered = []

        seen_podcast_names = set()

        for ep in episodes:
            url = ep.get("url")
            score = ep.get("score", 0)
            release_date = ep.get("release_date", "")
            podcast_name = ep.get("podcast_name")

            if not url or url in seen_urls or score <= 1:
                continue
            if not podcast_name or podcast_name in seen_podcast_names:
                continue

            parsed_date = parse_date(release_date)
            if not parsed_date:
                continue

            ep["_parsed_date"] = parsed_date
            seen_urls.add(url)
            seen_podcast_names.add(podcast_name)
            filtered.append(ep)

        filtered.sort(key=lambda ep: ep["_parsed_date"], reverse=True)
        top_episodes = filtered[:20]

        for ep in top_episodes:
            ep.pop("_parsed_date", None)

        top_stories_by_file[name.split("/")[1]] = top_episodes

    url = f"{CDN_URL}/upload"
    top_stories_by_file["timestamp"] = datetime.now().isoformat()
    headers = {"Content-Type": "application/json", "X-API-Token": API_TOKEN}
    payload = {"filename": "top_stories/top_stories.json", "data": top_stories_by_file}
    response = httpx.post(url, headers=headers, json=payload)
    print(response.text)
