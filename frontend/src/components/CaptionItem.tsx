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

interface EpisodeItemProps {
  episode: EnhancedEpisode;
  currentEmbedUrl: string | null;
  setCurrentEmbedUrl: (url: string | null) => void;
}

export const CaptionItem = ({
  episode,
  currentEmbedUrl,
  setCurrentEmbedUrl,
}: EpisodeItemProps) => {
  const { title, embedUrl, image } = episode;

  const handleClick = () => {
    setCurrentEmbedUrl(currentEmbedUrl === embedUrl ? null : embedUrl);
  };

  return (
    <article className="flex flex-col gap-2 mt-4">
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
