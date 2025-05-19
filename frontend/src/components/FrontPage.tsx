"use client";

import { useEpisodes } from "@/hooks/useEpisodes";
import { Hero } from "@/components/Hero";
import { FrontPageItem } from "./FrontPageItem";

interface Props {
  section?: string;
  currentEmbedUrl: string | null;
  setCurrentEmbedUrl: (url: string | null) => void;
}

export const FrontPage = ({
  section = "home",
  currentEmbedUrl,
  setCurrentEmbedUrl,
}: Props) => {
  const { episodes, expandedSummaries, toggleSummary, error } =
    useEpisodes(section);

  if (error) return <main className="p-8 text-red-600">Error: {error}</main>;

  const newsEpisodes = episodes.slice(1, 6);

  return (
    <main className="w-screen flex flex-col items-center">
      <section className="w-full xl:max-w-7xl p-8 bg-neutral-50 text-gray-900 space-y-6 pb-50">
        {newsEpisodes[0] && (
          <Hero
            key={newsEpisodes[0].embedId}
            episode={newsEpisodes[0]}
            expandedSummaries={expandedSummaries}
            toggleSummary={toggleSummary}
            currentEmbedUrl={currentEmbedUrl}
            setCurrentEmbedUrl={setCurrentEmbedUrl}
          />
        )}
        <div className="space-y-6 md:grid md:grid-cols-2">
          {newsEpisodes[1] && (
            <FrontPageItem
              key={newsEpisodes[1].embedId}
              episode={newsEpisodes[1]}
              expandedSummaries={expandedSummaries}
              toggleSummary={toggleSummary}
              currentEmbedUrl={currentEmbedUrl}
              setCurrentEmbedUrl={setCurrentEmbedUrl}
            />
          )}
          {newsEpisodes[2] && (
            <FrontPageItem
              key={newsEpisodes[2].embedId}
              episode={newsEpisodes[2]}
              expandedSummaries={expandedSummaries}
              toggleSummary={toggleSummary}
              currentEmbedUrl={currentEmbedUrl}
              setCurrentEmbedUrl={setCurrentEmbedUrl}
            />
          )}
          {newsEpisodes[3] && (
            <FrontPageItem
              key={newsEpisodes[3].embedId}
              episode={newsEpisodes[3]}
              expandedSummaries={expandedSummaries}
              toggleSummary={toggleSummary}
              currentEmbedUrl={currentEmbedUrl}
              setCurrentEmbedUrl={setCurrentEmbedUrl}
            />
          )}
          {newsEpisodes[4] && (
            <FrontPageItem
              key={newsEpisodes[4].embedId}
              episode={newsEpisodes[4]}
              expandedSummaries={expandedSummaries}
              toggleSummary={toggleSummary}
              currentEmbedUrl={currentEmbedUrl}
              setCurrentEmbedUrl={setCurrentEmbedUrl}
            />
          )}
        </div>
      </section>
    </main>
  );
};
