from pathlib import Path
import os
import shutil
import subprocess

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


def cleanup():
    ROOT = Path.cwd()
    charts_dir = ROOT / "charts"
    shows_dir = ROOT / "shows"
    sections_dir = ROOT / "frontend" / "public" / "sections"

    dirs_to_delete = [charts_dir, shows_dir, sections_dir]
    for dir in dirs_to_delete:
        if os.path.exists(dir):
            shutil.rmtree(dir)
            print(f"{str(dir)} deleted.")
        else:
            print(f"{str(dir)} does not exist.")

    log_path = "log.txt"
    if os.path.exists(log_path):
        os.remove(log_path)
        print(f"{str(log_path)} deleted.")
    else:
        print(f"{str(log_path)} does not exist.")


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
    # cleanup()
    # scrape_charts()
    create_tables()
    insert_podcasts()
    insert_downloads(status="active")
    # scrape_shows()
    insert_episodes()
    insert_scores()
    generate_section_feeds()
    generate_home_feed()
    push_feeds()


# Run the flow
if __name__ == "__main__":
    update_feeds()
