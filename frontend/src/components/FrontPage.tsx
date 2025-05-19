"use client";

import { useEpisodes } from "@/hooks/useEpisodes";
import { Hero } from "@/components/Hero";
import { FrontPageItem } from "./FrontPageItem";
import { CaptionItem } from "./CaptionItem";
import { CaptionHero } from "./CaptionHero";
import { SidebarBlock } from "./SidebarBlock";

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

  const [first, ...rest] = episodes.slice(0, 9);

  return (
    <main className="w-screen flex flex-col items-center">
      <div className="flex flex-row">
        <section className="w-full lg:max-w-3xl xl:max-w-5xl p-8 bg-neutral-50 text-gray-900 space-y-6 pb-50">
          {first && (
            <Hero
              key={first.embedId}
              episode={first}
              expandedSummaries={expandedSummaries}
              toggleSummary={toggleSummary}
              currentEmbedUrl={currentEmbedUrl}
              setCurrentEmbedUrl={setCurrentEmbedUrl}
            />
          )}
          <div className="space-y-6 lg:grid lg:grid-cols-2">
            {rest.map((episode) => (
              <FrontPageItem
                key={episode.embedId}
                episode={episode}
                expandedSummaries={expandedSummaries}
                toggleSummary={toggleSummary}
                currentEmbedUrl={currentEmbedUrl}
                setCurrentEmbedUrl={setCurrentEmbedUrl}
              />
            ))}
          </div>
        </section>
        <div className="hidden md:block md:max-w-2xs lg:max-w-sm pt-8 pr-8">
          <SidebarBlock
            episodes={episodes}
            currentEmbedUrl={currentEmbedUrl}
            setCurrentEmbedUrl={setCurrentEmbedUrl}
            rowOrColumn="row"
          />
          <SidebarBlock
            episodes={episodes}
            currentEmbedUrl={currentEmbedUrl}
            setCurrentEmbedUrl={setCurrentEmbedUrl}
            rowOrColumn="col"
          />
        </div>
      </div>
    </main>
  );
};
