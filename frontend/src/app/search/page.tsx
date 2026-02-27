"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { EpisodeItem } from "@/components/EpisodeItem";
import { useEmbedContext } from "@/context/EmbedContext";
import { useSearch } from "@/hooks/useSearch";
import { enhanceEpisodes } from "@/utils/episodeProcessing";
import type { SearchResult } from "@/hooks/useSearch";

function toEpisode(r: SearchResult) {
  return {
    title: r.title,
    podcast_name: r.podcast_name,
    summary: r.summary,
    url: r.url,
    embed_url: r.embed_url,
    image: r.image,
    duration: r.duration,
    release_date: r.release_date,
    score: r.score,
  };
}

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const { currentEmbedUrl, setCurrentEmbedUrl } = useEmbedContext();
  const { results, loading, fullSearch } = useSearch();
  const [expandedSummaries, setExpandedSummaries] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (q) fullSearch(q);
  }, [q, fullSearch]);

  const toggleSummary = (id: string) => {
    setExpandedSummaries((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const enhanced = enhanceEpisodes(results.map(toEpisode));

  return (
    <div className="min-h-screen bg-neutral-50 overflow-x-hidden">
      <Navbar params={Promise.resolve({ categories: [] })} />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">
          {q ? `Results for "${q}"` : "Search"}
        </h1>
        {loading && <p className="text-gray-500">Searching...</p>}
        {!loading && q && enhanced.length === 0 && (
          <p className="text-gray-500">No results found.</p>
        )}
        <div className="flex flex-col gap-4">
          {enhanced.map((episode) => (
            <EpisodeItem
              key={episode.embedId}
              episode={episode}
              expandedSummaries={expandedSummaries}
              toggleSummary={toggleSummary}
              currentEmbedUrl={currentEmbedUrl}
              setCurrentEmbedUrl={setCurrentEmbedUrl}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}
