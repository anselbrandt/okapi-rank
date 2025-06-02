from datetime import datetime, timedelta
import os
import shutil
import subprocess

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
    scrape_show,
)

UPDATE_INTERVAL = 15

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


def process_category(category, shows):
    global last_push_time

    for show in shows:

        result = scrape_show(show, db_path=paths.db_path)
        if result is None:
            continue
        show_id, show_page_html = result
        insert_episodes(db_path=paths.db_path, show_id=show_id, html=show_page_html)
        id, name, category, url, status = show
        print(category, name)

    insert_scores(db_path=paths.db_path)

    category_mappings = generate_category_mappings(
        db_path=paths.db_path, base_index=BASE_INDEX
    )
    filtered_mappings = {
        k: v
        for k, v in category_mappings.items()
        if k == category or category == "news" and k == "latest"
    }
    generate_section_feeds(
        db_path=paths.db_path,
        categories=filtered_mappings,
    )
    generate_top_stories()

    now = datetime.now()

    if not last_push_time or (now - last_push_time) > timedelta(
        minutes=UPDATE_INTERVAL
    ):
        push_feeds()
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
            if i == 0 or i % 4 == 0:
                process_category("news", grouped.get("news", []))
            if category != "news":
                process_category(category, shows)


if __name__ == "__main__":
    update_feeds()
