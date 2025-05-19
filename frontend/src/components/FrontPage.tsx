"use client";

import { useEpisodes } from "@/hooks/useEpisodes";
import { Hero } from "@/components/Hero";
import { FrontPageItem } from "./FrontPageItem";
import { GridItem } from "./GridItem";
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

  const [first, ...rest] = episodes.slice(1, 10);

  return (
    <main className="w-screen flex flex-col items-center">
      <div className="w-full lg:max-w-7xl ">
        <div className="flex flex-row border-b">
          <div className="w-full lg:max-w-3xl xl:max-w-5xl p-8 bg-neutral-50 text-gray-900 pb-8">
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
          </div>
          <div className="hidden md:block md:max-w-2xs lg:max-w-sm pt-8 pr-8">
            <SidebarBlock
              episodes={episodes}
              currentEmbedUrl={currentEmbedUrl}
              setCurrentEmbedUrl={setCurrentEmbedUrl}
              rowOrColumn="col"
              sectionTitle="Sidebar 1"
            />
          </div>
        </div>
        <div className="flex flex-row border-b">
          <div className="w-full lg:max-w-3xl xl:max-w-5xl px-8 pt-4 bg-neutral-50 text-gray-900 space-y-6 pb-8">
            <div className="text-2xl font-bold">Section 1</div>
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
          </div>
          <div className="hidden md:block md:max-w-2xs lg:max-w-sm pt-8 pr-8">
            <SidebarBlock
              episodes={episodes}
              currentEmbedUrl={currentEmbedUrl}
              setCurrentEmbedUrl={setCurrentEmbedUrl}
              rowOrColumn="row"
              sectionTitle="Sidebar 2"
            />
          </div>
        </div>
        <div className="flex flex-row border-b">
          <div className="w-full lg:max-w-3xl xl:max-w-5xl p-8 bg-neutral-50 text-gray-900 pb-8">
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
          </div>
          <div className="hidden md:block md:max-w-2xs lg:max-w-sm pt-8 pr-8">
            <SidebarBlock
              episodes={episodes}
              currentEmbedUrl={currentEmbedUrl}
              setCurrentEmbedUrl={setCurrentEmbedUrl}
              rowOrColumn="col"
              sectionTitle="Sidebar 3"
            />
          </div>
        </div>
        <div className="text-2xl font-bold px-8 pt-4">Section 2</div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-8 border-b">
          {rest.slice(0, 11).map((episode) => (
            <GridItem
              key={episode.embedId}
              episode={episode}
              currentEmbedUrl={currentEmbedUrl}
              setCurrentEmbedUrl={setCurrentEmbedUrl}
            />
          ))}
        </div>
        <div className="flex flex-row border-b">
          <div className="w-full lg:max-w-3xl xl:max-w-5xl p-8 bg-neutral-50 text-gray-900 pb-8">
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
          </div>
          <div className="hidden md:block md:max-w-2xs lg:max-w-sm pt-8 pr-8">
            <SidebarBlock
              episodes={episodes}
              currentEmbedUrl={currentEmbedUrl}
              setCurrentEmbedUrl={setCurrentEmbedUrl}
              rowOrColumn="col"
              sectionTitle="Sidebar 4"
            />
          </div>
        </div>
        <div className="text-2xl font-bold px-8 pt-4">Section 3</div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-8 pb-50">
          {rest.slice(0, 11).map((episode) => (
            <GridItem
              key={episode.embedId}
              episode={episode}
              currentEmbedUrl={currentEmbedUrl}
              setCurrentEmbedUrl={setCurrentEmbedUrl}
            />
          ))}
        </div>
      </div>
    </main>
  );
};
