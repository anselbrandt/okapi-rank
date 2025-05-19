import React from "react";

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
  episode: EnhancedEpisode;
  currentEmbedUrl: string | null;
  setCurrentEmbedUrl: (url: string | null) => void;
  rowOrColumn?: RowOrColumn;
}

export const CaptionItem = ({
  episode,
  currentEmbedUrl,
  setCurrentEmbedUrl,
  rowOrColumn = "col",
}: EpisodeItemProps) => {
  const { title, embedUrl, image } = episode;

  const handleClick = () => {
    setCurrentEmbedUrl(currentEmbedUrl === embedUrl ? null : embedUrl);
  };

  return (
    <article
      className={`flex flex-row sm:flex-col  lg:flex-${rowOrColumn} gap-2 p-4`}
    >
      <img
        src={image}
        alt="Episode image"
        className="w-32 h-32 object-cover rounded"
      />
      <div className="flex-1">
        <div className="flex justify-between">
          <div>
            <h2
              className="text-md hover:text-sky-600 cursor-pointer hover:underline"
              onClick={handleClick}
            >
              {title}
            </h2>
          </div>
        </div>
      </div>
    </article>
  );
};
