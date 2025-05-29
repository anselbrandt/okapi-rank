"use client";
import { useEmbedContext } from "@/context/EmbedContext";

export const Player = () => {
  const { currentEmbedUrl, setCurrentEmbedUrl } = useEmbedContext();

  if (!currentEmbedUrl) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center border-t border-neutral-300 bg-gradient-to-r from-neutral-100 to-neutral-50">
      <div className="relative w-full max-w-7xl">
        {/* Close Button */}
        <button
          onClick={() => setCurrentEmbedUrl(null)}
          aria-label="Close player"
          className="absolute top-2 right-3 w-8 h-8 flex items-center justify-center text-2xl text-violet-600 font-extrabold bg-violet-100 rounded-full shadow transition hover:bg-violet-600 hover:text-white"
        >
          ✕
        </button>

        {/* Embedded Audio Player */}
        <iframe
          src={currentEmbedUrl}
          height="175"
          className="w-full"
          allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  );
};
