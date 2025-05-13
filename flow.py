import subprocess
import os
from tasks import (
    create_tables,
    generate_home_feed,
    generate_section_feeds,
    insert_downloads,
    insert_episodes,
    insert_podcasts,
    insert_scores,
    push_feeds,
    scrape_shows,
)


def scrape_charts():
    script_path = os.path.join("scraper", "scrape_charts.js")
    try:
        result = subprocess.run(
            ["/home/ansel/.nvm/versions/node/v22.13.1/bin/node", script_path],
            check=True,
            text=True,
        )
        print("STDOUT:", result.stdout)
        print("STDERR:", result.stderr)
    except subprocess.CalledProcessError as e:
        print("Error running script:", e)
        print("STDERR:", e.stderr)


def update_feeds():
    scrape_charts()
    create_tables()
    insert_podcasts()
    insert_downloads()
    scrape_shows()
    insert_episodes()
    insert_scores()
    generate_section_feeds()
    generate_home_feed()
    push_feeds()


# Run the flow
if __name__ == "__main__":
    update_feeds()
