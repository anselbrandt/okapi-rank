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

export const CaptionHero = ({
  episode,
  currentEmbedUrl,
  setCurrentEmbedUrl,
}: EpisodeItemProps) => {
  const { title, embedUrl, image } = episode;

  const handleClick = () => {
    setCurrentEmbedUrl(currentEmbedUrl === embedUrl ? null : embedUrl);
  };

  return (
    <article className="flex flex-col">
      <img src={image.replaceAll("270", "540")} alt="Episode image" />
      <div className="flex-1">
        <div className="flex justify-between">
          <div>
            <h2
              className="py-2 text-xl font-serif font-semibold hover:text-sky-600 cursor-pointer hover:underline"
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
