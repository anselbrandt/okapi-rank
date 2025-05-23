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

export const GridItem = ({
  episode,
  currentEmbedUrl,
  setCurrentEmbedUrl,
}: EpisodeItemProps) => {
  const {
    title,
    podcast_name,
    formattedDate,
    formattedDuration,
    embedUrl,
    showUrl,
    image,
  } = episode;

  const handleClick = () => {
    setCurrentEmbedUrl(currentEmbedUrl === embedUrl ? null : embedUrl);
  };

  return (
    <article className={`flex md:flex-row gap-2 mt-4`}>
      <img
        src={image}
        alt="Episode image"
        className="hidden md:block w-32 h-32 object-cover rounded"
      />
      <div className="flex-1">
        <div className="flex justify-between">
          <div>
            <h2
              className="text-md font-bold hover:text-sky-600 cursor-pointer hover:underline"
              onClick={handleClick}
            >
              {title}
            </h2>
            <div className="md:hidden flex-wrap text-sm text-gray-500 gap-x-6 gap-y-1 mt-1">
              <a
                href={showUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sky-600 hover:underline font-medium mr-3"
              >
                {podcast_name}
              </a>
              <span className="mr-3">{formattedDate}</span>
              {formattedDuration && <span>{formattedDuration}</span>}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
