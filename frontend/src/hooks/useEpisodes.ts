import { useEffect, useState, useMemo } from "react";
import {
  formatTime,
  removeEmojis,
  formatDuration,
  toEmbedUrl,
  makeIdFromUrl,
} from "@/utils/episodes";

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

const SUMMARY_CUTOFF = 100;

const MAX_EPISODES = 1000;

export function useEpisodes(section: string = "home") {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [expandedSummaries, setExpandedSummaries] = useState<
    Record<string, boolean>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/sections/${section}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then((data: Episode[]) => {
        const now = Date.now();

        // Step 1: Score and sort
        const scored = data
          .map((ep) => ({
            ...ep,
            release_ts: new Date(ep.release_date).getTime(),
          }))
          .sort((a, b) => {
            const ageA = 1 - (now - a.release_ts) / (1000 * 60 * 60 * 24 * 365);
            const ageB = 1 - (now - b.release_ts) / (1000 * 60 * 60 * 24 * 365);
            const weightA = 0.6 * ageA + 0.4 * a.score;
            const weightB = 0.6 * ageB + 0.4 * b.score;
            return weightB - weightA;
          });

        // Step 2: Group by podcast_name
        const groups = new Map<string, Episode[]>();
        for (const ep of scored) {
          if (!groups.has(ep.podcast_name)) {
            groups.set(ep.podcast_name, []);
          }
          groups.get(ep.podcast_name)!.push(ep);
        }

        // Step 3: Interleave episodes from each podcast
        const interleaved: Episode[] = [];
        const groupIterators = Array.from(groups.values()).map((group) =>
          group[Symbol.iterator]()
        );
        let added = true;

        while (added && interleaved.length < MAX_EPISODES) {
          added = false;
          for (const iter of groupIterators) {
            const next = iter.next();
            if (!next.done) {
              interleaved.push(next.value);
              added = true;
              if (interleaved.length >= MAX_EPISODES) break;
            }
          }
        }

        setEpisodes(interleaved);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Unknown error");
        setLoading(false);
      });
  }, [section]);

  const enhancedEpisodes = useMemo(() => {
    return episodes.map((episode) => {
      const embedId = makeIdFromUrl(episode.url);
      const formattedDate = formatTime(episode.release_date);
      const formattedDuration = episode.duration
        ? formatDuration(episode.duration)
        : "";
      const cleanSummary =
        removeEmojis(episode.summary) || "No summary available.";
      const shortSummary =
        cleanSummary.length > SUMMARY_CUTOFF
          ? cleanSummary.slice(0, SUMMARY_CUTOFF) + "..."
          : cleanSummary;
      const embedUrl = episode.embed_url || toEmbedUrl(episode.url);
      const showUrl = episode.url.split("?")[0];

      return {
        ...episode,
        embedId,
        formattedDate,
        formattedDuration,
        summary: cleanSummary,
        shortSummary,
        embedUrl,
        showUrl,
      };
    });
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
