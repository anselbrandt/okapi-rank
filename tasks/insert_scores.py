import sqlite3
from datetime import datetime
from math import log
from pathlib import Path


def insert_scores(db_path: Path):
    date = datetime.now().isoformat()

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    conn.execute("BEGIN TRANSACTION")

    cursor.execute(
        """
        SELECT podcast.id, ranking.rank, podcast.rating, podcast.reviews
        FROM podcast
        JOIN ranking ON podcast.id = ranking.podcast_id
        WHERE ranking.rank IS NOT NULL
        """
    )
    podcasts = cursor.fetchall()

    podcast_scores = {}

    for podcast_id, rank_value, rating, reviews in podcasts:
        if rank_value > 0:
            base_score = 1 / rank_value

            rating_multiplier = (rating or 0) / 5.0 + 0.5

            review_multiplier = log(1 + (reviews or 0)) + 1

            adjusted_score = base_score * rating_multiplier * review_multiplier

            podcast_scores[podcast_id] = (
                podcast_scores.get(podcast_id, 0) + adjusted_score
            )

    score_entries = [
        (podcast_id, round(score, 4), date)
        for podcast_id, score in podcast_scores.items()
    ]

    cursor.executemany(
        """
        INSERT INTO score (podcast_id, rank_score, date)
        VALUES (?, ?, ?)
        """,
        score_entries,
    )

    conn.commit()
    conn.close()
