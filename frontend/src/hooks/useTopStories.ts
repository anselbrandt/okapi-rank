import { useEffect, useState } from "react";

import { enhanceEpisodes } from "@/utils/episodeProcessing";
import { NEXT_PUBLIC_CDN_URL } from "@/constants";

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

export type EnhancedEpisode = Episode & {
  embedId: string;
  formattedDate: string;
  formattedDuration: string;
  summary: string;
  shortSummary: string;
  embedUrl: string;
  showUrl: string;
};

export function useTopStories(section: string = "top_stories/top_stories") {
  const [episodes, setEpisodesBySection] = useState<
    Record<string, EnhancedEpisode[]>
  >({});
  const [expandedSummaries, setExpandedSummaries] = useState<
    Record<string, boolean>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${NEXT_PUBLIC_CDN_URL}/${section}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then((data: Record<string, Episode[]>) => {
        const processed: Record<string, EnhancedEpisode[]> = {};

        for (const [key, episodeList] of Object.entries(data)) {
          if (!Array.isArray(episodeList) || episodeList.length === 0) continue;

          const sorted = [...episodeList].sort((a, b) => b.score - a.score);
          const enhanced = enhanceEpisodes(sorted);
          processed[key] = enhanced;
        }

        setEpisodesBySection(processed);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Unknown error");
        setLoading(false);
      });
  }, [section]);

  const toggleSummary = (id: string) => {
    setExpandedSummaries((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return {
    episodes,
    expandedSummaries,
    toggleSummary,
    loading,
    error,
  };
}
