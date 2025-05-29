import React from "react";

import { CaptionItem } from "./CaptionItem";
import { CaptionHero } from "./CaptionHero";

interface EnhancedEpisode {
  embedId: string;
  title: string;
  podcast_name: string;
  release_date: string;
  formattedDate: string;
  formattedDuration?: string;
  summary: string;
  shortSummary: string;
  embedUrl: string;
  showUrl: string;
  image: string;
}

type RowOrColumn = "row" | "col";

interface EpisodeItemProps {
  episodes: EnhancedEpisode[];
  currentEmbedUrl: string | null;
  setCurrentEmbedUrl: (url: string | null) => void;
  imageSize?: number;
  rowOrColumn?: RowOrColumn;
  sectionTitle: string;
}

export const SidebarBlock = ({
  episodes,
  currentEmbedUrl,
  setCurrentEmbedUrl,
  imageSize = 500,
  rowOrColumn = "col",
  sectionTitle,
}: EpisodeItemProps) => {
  const [first, ...rest] = episodes.slice(0, 9);

  return (
    <>
      <div className="text-2xl font-semibold p-4">{sectionTitle}</div>
      <div className="flex flex-col sm:flex-row md:flex-col">
        {first && (
          <CaptionHero
            key={first.embedId + 1}
            episode={first}
            currentEmbedUrl={currentEmbedUrl}
            setCurrentEmbedUrl={setCurrentEmbedUrl}
            imageSize={imageSize}
          />
        )}
        <div
          className={`flex flex-col ${
            rowOrColumn == "row" ? "lg:flex-row" : ""
          } pb-8`}
        >
          {rest.slice(0, 2).map((episode) => (
            <CaptionItem
              key={episode.embedId + 1}
              episode={episode}
              currentEmbedUrl={currentEmbedUrl}
              setCurrentEmbedUrl={setCurrentEmbedUrl}
              rowOrColumn={rowOrColumn == "row" ? "col" : "row"}
            />
          ))}
        </div>
      </div>
    </>
  );
};
