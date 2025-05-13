from dataclasses import dataclass
from pathlib import Path


@dataclass
class Paths:
    data_dir: Path
    charts_dir: Path
    shows_dir: Path
    sections_dir: Path


paths = Paths(
    data_dir=Path("data").resolve(),
    charts_dir=Path("data/charts").resolve(),
    shows_dir=Path("data/shows").resolve(),
    sections_dir=Path("frontend/public/sections").resolve(),
)
