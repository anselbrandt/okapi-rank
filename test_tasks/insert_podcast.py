from datetime import datetime
from pathlib import Path
import re
import sqlite3

from selectolax.parser import HTMLParser


def extract_list(html):
    tree = HTMLParser(html)
    main = tree.css_first("main")
    if not main:
        return ""
    ul = main.css_first("ul")
    return ul.html if ul else ""


def extract_link_info(a_tag):
    if a_tag:
        href = a_tag.attrs.get("href", "")
        text = a_tag.text(strip=True)
        return href, text
    return None


def extract_links_from_list(html):
    tree = HTMLParser(html)
    links = []

    for li in tree.css("li"):
        a_tag = li.css_first("a")
        if a_tag:
            link_info = extract_link_info(a_tag)
            if link_info:
                links.append(link_info)

    return links


def get_links(html):
    list_html = extract_list(html)
    return extract_links_from_list(list_html)


def extract_show_id(url):
    match = re.search(r"/id(\d+)", url)
    return match.group(1) if match else None


def insert_podcast(db_path: Path, country, category, html):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    timestamp = datetime.now().isoformat()

    ranking_batch = []

    conn.execute("BEGIN TRANSACTION")

    links = get_links(html)
    for i, (url, name) in enumerate(links):
        show_id = extract_show_id(url)
        if not show_id:
            continue

        cursor.execute(
            """
            INSERT OR IGNORE INTO podcast (
                name, category, url, show_id, created_at, last_seen_at
            )
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (name, category, url, show_id, timestamp, timestamp),
        )

        cursor.execute(
            """
            UPDATE podcast SET last_seen_at = ? WHERE show_id = ?
            """,
            (timestamp, show_id),
        )

        cursor.execute(
            "SELECT id FROM podcast WHERE show_id = ?",
            (show_id,),
        )
        row = cursor.fetchone()
        if not row:
            continue
        podcast_id = row[0]

        ranking_batch.append((podcast_id, country, i + 1, timestamp, timestamp))

    cursor.executemany(
        """
        INSERT INTO ranking (podcast_id, country, rank, chart_date, scraped_at)
        VALUES (?, ?, ?, ?, ?)
        """,
        ranking_batch,
    )

    conn.commit()
    conn.close()
