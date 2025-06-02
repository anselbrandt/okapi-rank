# Okapi Rank

Okapi Rank is an episode-first podcast feed platform, built as a proof of concept and currently powered by Apple Podcasts’ Top Charts.

It aims to improve podcast discoverability by surfacing topical podcast episodes, organized thematically.

## Architecture

### Data Pipeline

#### `flow.py`

- Core ETL and scheduling loop
- Scrapes Apple Podcast Top Charts using [Puppeteer](https://pptr.dev/)
- Checks individual show pages every 15 minutes for new episodes
- Parses show pages and persists episode data to a local SQLite database
- Generates static episode feeds for each category
- Uploads feeds to a CDN
- Triggers deployment (via commit push or webhook)

### CDN

- Lightweight FastAPI application for accepting precomputed JSON feeds
- Serves JSON feeds to the frontend for the initial page load (subsequent requests are cached)

### Frontend

- Built with TypeScript, Next.js, and Tailwind CSS
- Audio playback is managed by a Context provider to maintain state across navigation

## Install and Run

### Data Pipeline

```bash
uv sync

uv run task flow.py
```

### CDN

```bash
cd cdn

uv sync

uv run task start
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```
