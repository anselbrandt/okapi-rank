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
  expandedSummaries: Record<string, boolean>;
  toggleSummary: (id: string) => void;
  currentEmbedUrl: string | null;
  setCurrentEmbedUrl: (url: string | null) => void;
  imageSize?: number;
}

export const Hero = ({
  episode,
  expandedSummaries,
  toggleSummary,
  currentEmbedUrl,
  setCurrentEmbedUrl,
  imageSize = 1000,
}: EpisodeItemProps) => {
  const {
    embedId,
    title,
    podcast_name,
    formattedDate,
    formattedDuration,
    summary,
    shortSummary,
    embedUrl,
    showUrl,
    image,
  } = episode;

  const isExpanded = expandedSummaries[embedId] ?? false;
  const showToggle = summary.length > 100;

  const handleClick = () => {
    setCurrentEmbedUrl(currentEmbedUrl === embedUrl ? null : embedUrl);
  };

  return (
    <article className="flex flex-col">
      <img
        src={image.replaceAll(
          "270x270",
          `${imageSize.toString()}x${imageSize.toString()}`
        )}
        alt="Episode image"
      />
      <div className="flex-1">
        <div className="flex justify-between">
          <div>
            <h2
              className="py-2 text-4xl font-serif font-bold hover:text-sky-600 cursor-pointer hover:underline"
              onClick={handleClick}
            >
              {title}
            </h2>
            <div className="flex flex-wrap text-sm text-gray-500 gap-x-6 gap-y-1 mt-1">
              <a
                href={showUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sky-600 hover:underline font-medium"
              >
                {podcast_name}
              </a>
              <span>{formattedDate}</span>
              {formattedDuration && <span>{formattedDuration}</span>}
            </div>
          </div>
        </div>
        <p className="mt-2">
          {isExpanded ? summary : shortSummary}{" "}
          {showToggle && (
            <button
              onClick={() => toggleSummary(embedId)}
              className="text-sky-700 hover:underline"
            >
              {isExpanded ? "[ - ]" : "[ + ]"}
            </button>
          )}
        </p>
      </div>
    </article>
  );
};
