from dotenv import load_dotenv

from constants import paths
from categories import NEW_CATEGORY_MAPPINGS

from tasks import (
    generate_home_feed,
    generate_section_feeds,
)

load_dotenv()


def make_dirs():
    dirs = [paths.data_dir, paths.charts_dir, paths.shows_dir, paths.sections_dir]
    for dir in dirs:
        dir.mkdir(exist_ok=True, parents=True)


def update_feeds():
    make_dirs()
    generate_section_feeds(
        db_path=paths.db_path,
        sections_dir=paths.sections_dir,
        categories=NEW_CATEGORY_MAPPINGS,
    )
    generate_home_feed(
        sections_dir=paths.sections_dir,
    )


if __name__ == "__main__":
    update_feeds()
