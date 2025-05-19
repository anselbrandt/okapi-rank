"use client";

import { useEpisodes } from "@/hooks/useEpisodes";
import { Hero } from "@/components/Hero";
import { FrontPageItem } from "./FrontPageItem";
import { CaptionItem } from "./CaptionItem";

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
      <div className="flex flex-row">
        <section className="w-full lg:max-w-3xl xl:max-w-5xl p-8 bg-neutral-50 text-gray-900 space-y-6 pb-50">
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
          <div className="space-y-6 lg:grid lg:grid-cols-2">
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
        <div className="hidden md:block md:max-w-2xs lg:max-w-sm pt-8 pr-8">
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
          <div className="flex flex-row">
            {newsEpisodes[2] && (
              <CaptionItem
                key={newsEpisodes[2].embedId}
                episode={newsEpisodes[2]}
                currentEmbedUrl={currentEmbedUrl}
                setCurrentEmbedUrl={setCurrentEmbedUrl}
              />
            )}
            {newsEpisodes[3] && (
              <CaptionItem
                key={newsEpisodes[3].embedId}
                episode={newsEpisodes[3]}
                currentEmbedUrl={currentEmbedUrl}
                setCurrentEmbedUrl={setCurrentEmbedUrl}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
