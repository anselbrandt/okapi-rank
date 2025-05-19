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

export type EnhancedEpisode = Episode & {
  embedId: string;
  formattedDate: string;
  formattedDuration: string;
  summary: string;
  shortSummary: string;
  embedUrl: string;
  showUrl: string;
};

const SUMMARY_CUTOFF = 100;

export function scoreAndSortEpisodes_by_score(
  episodes: Episode[]
): (Episode & { release_ts: number })[] {
  const now = Date.now();

  return episodes
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
}

export function scoreAndSortEpisodes(
  episodes: Episode[]
): (Episode & { release_ts: number })[] {
  return episodes
    .map((ep) => ({
      ...ep,
      release_ts: new Date(ep.release_date).getTime(),
    }))
    .sort((a, b) => b.release_ts - a.release_ts);
}

export function interleaveEpisodesByPodcast(
  episodes: Episode[],
  maxCount: number
): Episode[] {
  const groups = new Map<string, Episode[]>();
  for (const ep of episodes) {
    if (!groups.has(ep.podcast_name)) {
      groups.set(ep.podcast_name, []);
    }
    groups.get(ep.podcast_name)!.push(ep);
  }

  const interleaved: Episode[] = [];
  const groupIterators = Array.from(groups.values()).map((group) =>
    group[Symbol.iterator]()
  );
  let added = true;

  while (added && interleaved.length < maxCount) {
    added = false;
    for (const iter of groupIterators) {
      const next = iter.next();
      if (!next.done) {
        interleaved.push(next.value);
        added = true;
        if (interleaved.length >= maxCount) break;
      }
    }
  }

  return interleaved;
}

export function enhanceEpisodes(episodes: Episode[]): EnhancedEpisode[] {
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
}
