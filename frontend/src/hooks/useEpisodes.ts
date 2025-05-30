import { useEffect, useState, useMemo } from "react";

import {
  scoreAndSortEpisodes,
  interleaveEpisodesByPodcast,
  enhanceEpisodes,
} from "@/utils/episodeProcessing";

type Episode = {
  title: string;
  podcast_name: string;
  release_date: string;
  score: number;
  summary?: string;
  url: string;
  embed_url?: string;
  image: string;
  duration?: string;
};

const MAX_EPISODES = 1000;

export function useEpisodes(section: string = "latest/latest") {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [expandedSummaries, setExpandedSummaries] = useState<
    Record<string, boolean>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`https://cdn.anselbrandt.net/${section}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then((data: Episode[]) => {
        const scored = scoreAndSortEpisodes(data);
        const interleaved = interleaveEpisodesByPodcast(scored, MAX_EPISODES);
        setEpisodes(interleaved);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Unknown error");
        setLoading(false);
      });
  }, [section]);

  const enhancedEpisodes = useMemo(() => {
    return enhanceEpisodes(episodes);
  }, [episodes]);

  const toggleSummary = (id: string) => {
    setExpandedSummaries((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return {
    episodes: enhancedEpisodes,
    expandedSummaries,
    toggleSummary,
    loading,
    error,
  };
}
