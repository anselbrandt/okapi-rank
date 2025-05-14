from dataclasses import dataclass
from pathlib import Path


@dataclass
class Paths:
    db_path: Path
    data_dir: Path
    charts_dir: Path
    shows_dir: Path
    sections_dir: Path


paths = Paths(
    db_path=Path("data/podcasts.db").resolve(),
    data_dir=Path("data").resolve(),
    charts_dir=Path("data/charts").resolve(),
    shows_dir=Path("data/shows").resolve(),
    sections_dir=Path("frontend/public/sections").resolve(),
)
