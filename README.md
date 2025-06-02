# Okapi Rank

Okapi Rank is an episode-first podcast feed platform built as a proof of concept and presently based on Apple Podcast Top Charts.

It aims to improve podcast discoverability by surfacing topical podcast episodes, organized thematically.

## Architecture

### Data Pipeline

#### `flow.py`

- Core ETL and scheduling loop
- Scrapes Apple Podcast Top Charts using [Puppeteer](https://pptr.dev/)
- Scrapes individual show pages every 15 mins checking for new episodes.
- Parse show pages and persist episode data to local SQLite db
- Generate static feeds of episodes for each category
- Uploads feeds to the CDN
- Triggers deployment (either by pushing a commit or triggering a webhook)

### CDN

- Lighweight FastAPI application for accepting precomputed JSON feeds
- Serves JSON feeds to the frontend infracture for initial page load (subsequent requests are cached)

### Frontend

- Typescript, Next.js, Tailwind
- Audio playback handled by Context provider to preserve state during navigation

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
