"use client";
import Link from "next/link";

import { useTopStories } from "@/hooks/useTopStories";
import { Hero } from "@/components/Hero";
import { FrontPageItem } from "./FrontPageItem";
import { GridItem } from "./GridItem";
import { SidebarBlock } from "./SidebarBlock";

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

interface Props {
  currentEmbedUrl: string | null;
  setCurrentEmbedUrl: (url: string | null) => void;
}

function sortEpisodesByScore(episodes: EnhancedEpisode[]) {
  return [...episodes].sort((a, b) => b.score - a.score);
}

export const FrontPage = ({ currentEmbedUrl, setCurrentEmbedUrl }: Props) => {
  const { episodes, expandedSummaries, toggleSummary, loading, error } =
    useTopStories("top_stories/top_stories");

  if (error) return <main className="p-8 text-red-600">Error: {error}</main>;

  // Wait until data has loaded and at least `news` section exists
  if (loading || !episodes["news"]) {
    return <main className="p-8 text-gray-500">Loading...</main>;
  }

  const [top_news, ...news] = sortEpisodesByScore(episodes["news"]);
  const world = sortEpisodesByScore(episodes["world"]);
  const europe = sortEpisodesByScore(episodes["europe"]);
  const [top_commentary, ...commentary] = sortEpisodesByScore(
    episodes["news_commentary"]
  );
  const politics = sortEpisodesByScore(episodes["politics"]);
  const [top_society, ...society] = sortEpisodesByScore(
    episodes["society_and_culture"]
  );
  const arts = sortEpisodesByScore(episodes["arts"]);

  return (
    <main className="w-screen flex flex-col items-center">
      <div className="w-full lg:max-w-7xl">
        <div className="flex flex-col md:flex-row border-b">
          <div className="w-full lg:max-w-3xl xl:max-w-5xl p-8 bg-neutral-50 text-gray-900 pb-8">
            {top_news && (
              <Hero
                key={top_news.embedId}
                episode={top_news}
                expandedSummaries={expandedSummaries}
                toggleSummary={toggleSummary}
                currentEmbedUrl={currentEmbedUrl}
                setCurrentEmbedUrl={setCurrentEmbedUrl}
              />
            )}
          </div>
          <div className="w-full md:max-w-2xs lg:max-w-sm p-8">
            <SidebarBlock
              episodes={world}
              currentEmbedUrl={currentEmbedUrl}
              setCurrentEmbedUrl={setCurrentEmbedUrl}
              rowOrColumn="col"
              sectionTitle="World"
              sectionLink="/news/world"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row border-b">
          <div className="w-full lg:max-w-3xl xl:max-w-5xl px-8 pt-4 bg-neutral-50 text-gray-900 space-y-6 pb-8">
            <div><Link href="/news" className="text-2xl font-bold hover:text-sky-700 transition">Top News</Link></div>
            <div className="space-y-6 lg:grid lg:grid-cols-2">
              {news.slice(0, 12).map((episode) => (
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
          <div className="w-full md:max-w-2xs lg:max-w-sm p-8">
            <SidebarBlock
              episodes={europe}
              currentEmbedUrl={currentEmbedUrl}
              setCurrentEmbedUrl={setCurrentEmbedUrl}
              rowOrColumn="row"
              sectionTitle="Europe"
              sectionLink="/news/europe"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row border-b">
          <div className="w-full lg:max-w-3xl xl:max-w-5xl p-8 bg-neutral-50 text-gray-900 pb-8">
            {top_commentary && (
              <Hero
                key={top_commentary.embedId}
                episode={top_commentary}
                expandedSummaries={expandedSummaries}
                toggleSummary={toggleSummary}
                currentEmbedUrl={currentEmbedUrl}
                setCurrentEmbedUrl={setCurrentEmbedUrl}
              />
            )}
          </div>
          <div className="w-full md:max-w-2xs lg:max-w-sm p-8">
            <SidebarBlock
              episodes={politics}
              currentEmbedUrl={currentEmbedUrl}
              setCurrentEmbedUrl={setCurrentEmbedUrl}
              rowOrColumn="col"
              sectionTitle="Politics"
              sectionLink="/news/politics"
            />
          </div>
        </div>

        <div><Link href="/news/news_commentary" className="text-2xl font-bold px-8 pt-4 hover:text-sky-700 transition">Top Commentary</Link></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-8 border-b">
          {commentary.slice(0, 12).map((episode) => (
            <GridItem
              key={episode.embedId}
              episode={episode}
              currentEmbedUrl={currentEmbedUrl}
              setCurrentEmbedUrl={setCurrentEmbedUrl}
            />
          ))}
        </div>

        <div className="flex flex-col md:flex-row border-b">
          <div className="w-full lg:max-w-3xl xl:max-w-5xl p-8 bg-neutral-50 text-gray-900 pb-8">
            {top_society && (
              <Hero
                key={top_society.embedId}
                episode={top_society}
                expandedSummaries={expandedSummaries}
                toggleSummary={toggleSummary}
                currentEmbedUrl={currentEmbedUrl}
                setCurrentEmbedUrl={setCurrentEmbedUrl}
              />
            )}
          </div>
          <div className="w-full md:max-w-2xs lg:max-w-sm p-8">
            <SidebarBlock
              episodes={arts}
              currentEmbedUrl={currentEmbedUrl}
              setCurrentEmbedUrl={setCurrentEmbedUrl}
              rowOrColumn="col"
              sectionTitle="Arts"
              sectionLink="/arts"
            />
          </div>
        </div>

        <div><Link href="/society_and_culture" className="text-2xl font-bold px-8 pt-4 hover:text-sky-700 transition">Society and Culture</Link></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-8 pb-50">
          {society.slice(0, 12).map((episode) => (
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
