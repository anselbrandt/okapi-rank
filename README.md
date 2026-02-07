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
- Classifies episodes using the zero-shot [Bart Large Mnli](https://huggingface.co/facebook/bart-large-mnli) model.
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

uv run flow.py
```

#### Running as a systemd service

The included `okapi-rank.service` file configures the data pipeline to run as a systemd service with automatic restart on failure.

Install and enable the service:

```bash
sudo cp okapi-rank.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now okapi-rank
```

Useful commands:

```bash
# Check status
sudo systemctl status okapi-rank

# View logs
journalctl -u okapi-rank -f

# Stop the service
sudo systemctl stop okapi-rank

# Restart the service
sudo systemctl restart okapi-rank

# Disable the service from starting on boot
sudo systemctl disable okapi-rank
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
