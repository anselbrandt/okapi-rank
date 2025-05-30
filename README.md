# Okapi Rank

### Install

```bash
uv sync
```

### Run

#### 1. Scrape Charts

First run the Node.js Puppeteer scraper:

```bash
cd scraper

node scrape_charts.js
```

#### 2. Run Workflows

In the `workflow/` folder, run the following notebooks in this order:

1. `db_ops`
2. `shows` (may take 2 to 3 hours)
3. `episodes`
4. `section_feed`
5. `home_feed`

#### 3. Run locally

```bash
cd frontend

npm install

npm run dev
```

#### 4. Commit and Push (to deploy)

Updated static content will be in the `frontend/public` folder.

#### 5. Trigger Vercel Deploy Hook

```
curl -X POST https://api.vercel.com/v1/integrations/deploy/VERCEL_PROJECT_ID_AND_WEBHOOK_ID
```

```
{
  "job": {
    "id": "okzCd50AIap1O31g0gne",
    "state": "PENDING",
    "createdAt": 1662825789999
  }
}
```
