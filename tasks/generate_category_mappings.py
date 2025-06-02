from collections import defaultdict
from pathlib import Path
import json
import re
import sqlite3

from categories import BASE_INDEX


more_news = {
    "world": {
        "name": "world",
        "displayName": "World",
        "desc": "World news and international affairs",
        "match_categories": [
            ["news", "Business News"],
            ["news", "Daily News"],
            ["news", "News"],
            ["news", "News Commentary"],
            ["news", "Politics"],
        ],
    },
    "us": {
        "name": "us",
        "displayName": "US",
        "desc": "News about the United States",
        "match_categories": [
            ["news", "Business News"],
            ["news", "Daily News"],
            ["news", "News"],
            ["news", "News Commentary"],
            ["news", "Politics"],
        ],
    },
    "canada": {
        "name": "canada",
        "displayName": "Canada",
        "desc": "News about Canada",
        "match_categories": [
            ["news", "Business News"],
            ["news", "Daily News"],
            ["news", "News"],
            ["news", "News Commentary"],
            ["news", "Politics"],
        ],
    },
    "uk": {
        "name": "uk",
        "displayName": "UK",
        "desc": "News about the United Kingdom",
        "match_categories": [
            ["news", "Business News"],
            ["news", "Daily News"],
            ["news", "News"],
            ["news", "News Commentary"],
            ["news", "Politics"],
        ],
    },
    "europe": {
        "name": "europe",
        "displayName": "Europe",
        "desc": "News about Europe",
        "match_categories": [
            ["news", "Business News"],
            ["news", "Daily News"],
            ["news", "News"],
            ["news", "News Commentary"],
            ["news", "Politics"],
        ],
    },
    "ukraine": {
        "name": "ukraine",
        "displayName": "Ukraine",
        "desc": "News related to Ukraine and the war",
        "match_categories": [
            ["news", "Business News"],
            ["news", "Daily News"],
            ["news", "News"],
            ["news", "News Commentary"],
            ["news", "Politics"],
        ],
    },
    "middleeast": {
        "name": "middleeast",
        "displayName": "Middle East",
        "desc": "News from the Middle East region",
        "match_categories": [
            ["news", "Business News"],
            ["news", "Daily News"],
            ["news", "News"],
            ["news", "News Commentary"],
            ["news", "Politics"],
        ],
    },
}


def get_paths(categories):
    paths = []

    for key, value in categories.items():
        if "subcategories" in value:
            for subcategory in value["subcategories"]:
                paths.append({"categories": [key, subcategory]})

    return paths


def safe(str):
    return str.lower().replace("&", "and").replace(" ", "_")


def unsafe(str):
    return str.replace("_and_", " & ").replace("_", " ").title()


def make_head(str):
    return {"name": safe(str), "displayName": unsafe(str)}


def generate_category_mappings(db_path: Path, base_index):
    out_dir = Path("categories")
    out_dir.mkdir(exist_ok=True)

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT category, subcategory, COUNT(*) as count
        FROM podcast
        GROUP BY category, subcategory
        ORDER BY category, subcategory
    """
    )

    category_data = defaultdict(list)

    for category, subcategory, count in cursor.fetchall():
        category_data[category].append([category, subcategory])

    conn.close()

    output = base_index

    for main_cat, entries in category_data.items():
        head = make_head(main_cat)
        subcategories = {}
        for entry in entries:
            main_cat, sub_cat = entry
            if sub_cat == "UNKNOWN":
                continue
            match_categories = [entry]
            if main_cat == safe(sub_cat):
                match_categories.append([main_cat, "UNKNOWN"])
            subcategories[safe(sub_cat)] = {
                **make_head(sub_cat),
                "match_categories": match_categories,
            }
        output[main_cat] = {**head, "subcategories": subcategories}

    output["news"]["subcategories"] = {**more_news, **output["news"]["subcategories"]}

    out_file = out_dir / "category_mappings.py"

    json_str = json.dumps(output)

    python_str = f"CATEGORY_MAPPINGS = {json_str}"

    with open(out_file, "w", encoding="utf-8") as f:
        f.write(python_str)

    js_object = re.sub(r'"(\w+)":', r"\1:", json_str)

    js_head = r"""
type Subcategory = {
  name: string;
  displayName: string;
  desc?: string;
  match_categories?: string[][];
};

export type Category = {
  name: string;
  displayName: string;
  subcategories?: {
    [key: string]: Subcategory;
  };
};

type Categories = {
  [key: string]: Category;
};

export const CATEGORIES: Categories =
"""

    js_str = f"{js_head} {js_object}"
    js_out_file = Path("frontend/src/data/categories.ts")

    with open(js_out_file, "w", encoding="utf-8") as f:
        f.write(js_str)

    paths = get_paths(output)
    paths_str = json.dumps(paths)
    js_paths = re.sub(r'"(\w+)":', r"\1:", paths_str)
    js_paths_str = f"export const PATHS = {js_paths}"
    js_paths_file = Path("frontend/src/data/paths.ts")

    with open(js_paths_file, "w", encoding="utf-8") as f:
        f.write(js_paths_str)

    return output
