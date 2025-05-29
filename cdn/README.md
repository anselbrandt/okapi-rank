# Simple Cloud Storage and Static File Server for Next.js Build

```
curl -X POST http://localhost:8000/upload \
  -H "Content-Type: application/json" \
  -H "X-API-Token: sample-api-token" \
  -d '{
  "filename": "top_stories/top_stories.json",
  "data": [
    {
      "title": "Populism and the Deep State w/ Robert Barnes (Live)",
      "subcategory": "News",
      "release_date": "2025-05-26T20:16:38Z",
      "score": 4.6068,
      "podcast_name": "The Duran Podcast",
      "url": "https://podcasts.apple.com/gb/podcast/populism-and-the-deep-state-w-robert-barnes-live/id1442883993?i=1000709983403",
      "summary": "Populism and the Deep State w/ Robert Barnes (Live)",
      "image": "https://is1-ssl.mzstatic.com/image/thumb/Podcasts125/v4/1d/6b/36/1d6b3681-8e40-4d3a-633a-ee4ac0ba7445/mza_1830853894073669904.jpg/270x270bb.webp 270w",
      "embed_url": "https://embed.podcasts.apple.com/gb/podcast/populism-and-the-deep-state-w-robert-barnes-live/id1442883993?i=1000709983403",
      "duration": "9084",
      "tag": "news"
    }
  ]
}'
```

```
curl localhost:8000/top_stories/top_stories.json
```
