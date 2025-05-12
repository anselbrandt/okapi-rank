"use client";

import { useEpisodes } from "@/hooks/useEpisodes";
import { EpisodeItem } from "@/components/EpisodeItem";

interface Props {
  section?: string;
  currentEmbedUrl: string | null;
  setCurrentEmbedUrl: (url: string | null) => void;
}

export const Feed = ({
  section = "home",
  currentEmbedUrl,
  setCurrentEmbedUrl,
}: Props) => {
  const { episodes, expandedSummaries, toggleSummary, loading, error } =
    useEpisodes(section);

  if (loading) return <main className="p-8">Loading...</main>;
  if (error) return <main className="p-8 text-red-600">Error: {error}</main>;

  return (
    <main className="w-screen flex flex-col items-center">
      <section className="w-full xl:max-w-7xl p-8 bg-neutral-50 text-gray-900 space-y-6 pb-50">
        {episodes.map((episode) => {
          const isExpanded = expandedSummaries[episode.embedId] ?? false;
          const showToggle = episode.summary.length > 100;

          return (
            <EpisodeItem
              key={episode.embedId}
              episode={episode}
              isExpanded={isExpanded}
              showToggle={showToggle}
              currentEmbedUrl={currentEmbedUrl}
              setCurrentEmbedUrl={setCurrentEmbedUrl}
              toggleSummary={toggleSummary}
            />
          );
        })}
      </section>
    </main>
  );
};
