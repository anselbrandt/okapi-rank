from pathlib import Path
import json
import sqlite3
from transformers.pipelines import pipeline
from urllib.parse import urlparse


def to_embed_url(url: str) -> str:
    """Convert Apple Podcasts URLs to embeddable URLs."""
    parsed = urlparse(url)
    if "podcasts.apple.com" in parsed.netloc:
        return f"https://embed.podcasts.apple.com{parsed.path}?{parsed.query}"
    return url


def generate_section_feeds():
    ROOT_DIR = Path(__file__).resolve().parents[1]
    out_dir = ROOT_DIR / "frontend" / "public" / "sections"
    out_dir.mkdir(exist_ok=True)

    classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

    conn = sqlite3.connect("../podcasts.db")
    cursor = conn.cursor()

    categories_dir = ROOT_DIR / "categories"
    category_mapping = categories_dir / "category_mapping.json"
    with open(category_mapping, "r", encoding="utf-8") as f:
        data = json.load(f)

    for section in data.values():
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
                        AND e.release_date <= date('now')
                        AND CAST(e.duration AS INTEGER) > 600
                    ORDER BY 
                        e.release_date DESC
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
                out_file = out_dir / f"{subcat_name}.json"
                print(subcat_name, len(matching_episodes))
                with open(out_file, "w", encoding="utf-8") as f:
                    json.dump(matching_episodes, f)
                    f.close()

    conn.close()


if __name__ == "__main__":
    generate_section_feeds()
