import sqlite3
from pathlib import Path
from selectolax.parser import HTMLParser
import json
from datetime import datetime, timedelta, timezone


def get_image(item, key):
    value = item.get(key)
    if isinstance(value, dict):
        template = value.get("template")
        if template:
            return template.replace("{w}x{h}bb.{f}", "270x270bb.webp 270w")
    return None


def calculate_release_delta(release_dates):
    release_dates.sort()
    diffs = [
        (release_dates[i] - release_dates[i - 1]).total_seconds()
        for i in range(1, len(release_dates))
    ]
    return sum(diffs) / len(diffs) if diffs else 0


def estimate_frequency_from_delta(avg_delta):
    if avg_delta < 86400:
        return "hourly"
    elif avg_delta < 604800:
        return "daily"
    else:  # weekly
        return "weekly"


def calculate_next_scrape(release_date, frequency):
    if frequency == "hourly":
        return release_date + timedelta(hours=3)
    elif frequency == "daily":
        return release_date + timedelta(hours=12)
    elif frequency == "weekly":
        return release_date + timedelta(hours=24)
    return release_date


def process_file(html, podcast_id, cursor, scraped_at):
    tree = HTMLParser(html)
    script = next(
        (
            s
            for s in tree.css("script")
            if s.attributes.get("id") == "serialized-server-data"
        ),
        None,
    )
    if not script:
        return

    try:
        raw_json = json.loads(script.text())
    except json.JSONDecodeError:
        return

    items = raw_json[0].get("data", {}).get("shelves", [])

    metadata_items = next(
        (shelf for shelf in items if shelf.get("contentType") == "showHeaderRegular"),
        {},
    ).get("items", [])
    metadata = metadata_items[0].get("metadata")
    metadata_dict = {k: v for d in metadata for k, v in d.items()}
    subcategory = metadata_dict.get("category")
    update_frequency = metadata_dict.get("updateFrequency")
    ratings = metadata_dict.get("ratings")
    ratingAverage = ratings.get("ratingAverage")
    totalNumberOfRatings = ratings.get("totalNumberOfRatings")
    if not isinstance(subcategory, str):
        subcategory = subcategory.get("title")

    cursor.execute(
        """
            UPDATE podcast
            SET subcategory = ?, update_frequency = ?, rating = ?, reviews = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?;
        """,
        (
            subcategory,
            update_frequency,
            ratingAverage,
            totalNumberOfRatings,
            podcast_id,
        ),
    )

    episodes = next(
        (shelf for shelf in items if shelf.get("contentType") == "episode"), {}
    ).get("items", [])

    cutoff_date = datetime.now(timezone.utc) - timedelta(days=14)
    release_dates = []

    for item in episodes:
        release_str = item.get("releaseDate")
        has_free_version = item.get("hasFreeVersion")
        if not has_free_version:
            continue
        try:
            release_date = datetime.strptime(release_str, "%Y-%m-%dT%H:%M:%SZ")
            release_date = release_date.replace(tzinfo=timezone.utc)
        except (TypeError, ValueError):
            continue

        if release_date < cutoff_date:
            continue

        release_dates.append(release_date)

        try:
            cursor.execute(
                """
                INSERT OR IGNORE INTO episode (
                    podcast_id, episode_id, show_title, show_id, title,
                    release_date, duration, has_free_version, channel_name,
                    show_image, episode_image, show_alt_image, episode_url,
                    summary, caption, short_caption, scraped_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    podcast_id,
                    item.get("adamId"),
                    item.get("showTitle"),
                    int(item.get("showAdamId", 0)),
                    item.get("title"),
                    release_str,
                    (
                        str(item.get("duration"))
                        if item.get("duration") is not None
                        else None
                    ),
                    (
                        bool(item.get("hasFreeVersion"))
                        if item.get("hasFreeVersion") is not None
                        else None
                    ),
                    item.get("channelName"),
                    get_image(item, "icon"),
                    get_image(item, "episodeArtwork"),
                    get_image(item, "showUberArtwork"),
                    item.get("clickAction", {}).get("pageUrl"),
                    item.get("summary"),
                    item.get("caption"),
                    item.get("shortCaption"),
                    scraped_at,
                ),
            )
        except Exception as e:
            print(f"Error inserting episode for podcast {podcast_id}: {e}")

    if release_dates:
        avg_delta = calculate_release_delta(release_dates)

        if any(release_date >= cutoff_date for release_date in release_dates):
            frequency = estimate_frequency_from_delta(avg_delta)
            most_recent_release = max(release_dates)
            next_scrape = calculate_next_scrape(most_recent_release, frequency)

            try:
                cursor.execute(
                    """
                    INSERT OR REPLACE INTO frequency (podcast_id, frequency, next_scrape)
                    VALUES (?, ?, ?)
                    """,
                    (podcast_id, frequency, next_scrape.isoformat()),
                )
            except Exception as e:
                print(f"Error updating frequency for podcast {podcast_id}: {e}")


def insert_episodes(db_path: Path, show_id, html):
    scraped_at = datetime.now(timezone.utc).isoformat()
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    conn.execute("PRAGMA foreign_keys = ON")

    cursor.execute("SELECT id FROM podcast WHERE show_id = ?", (show_id,))
    row = cursor.fetchone()
    if row:
        podcast_id = row[0]
        process_file(html, podcast_id, cursor, scraped_at)

    conn.commit()
    conn.close()
