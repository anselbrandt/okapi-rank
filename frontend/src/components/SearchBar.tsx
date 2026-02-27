"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearch } from "@/hooks/useSearch";
import { useEmbedContext } from "@/context/EmbedContext";

export const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { setCurrentEmbedUrl } = useEmbedContext();
  const { suggestions, loadIndex, onQueryChange, setSuggestions } = useSearch();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFocus = () => {
    loadIndex();
    if (suggestions.length > 0) setShowDropdown(true);
  };

  const handleChange = (value: string) => {
    setQuery(value);
    onQueryChange(value);
    setShowDropdown(true);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setShowDropdown(false);
    setSuggestions([]);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSuggestionClick = (embedUrl: string) => {
    setShowDropdown(false);
    setSuggestions([]);
    setCurrentEmbedUrl(embedUrl);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={handleFocus}
          placeholder="Search podcasts..."
          className="flex-1 px-3 py-1.5 border border-neutral-300 rounded text-sm focus:outline-none focus:border-sky-500"
        />
        <button
          type="submit"
          className="px-4 py-1.5 bg-sky-700 text-white text-sm font-semibold rounded hover:bg-sky-800 transition"
        >
          Search
        </button>
      </form>

      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-neutral-200 rounded shadow-lg max-h-96 overflow-y-auto">
          {suggestions.map((item, i) => (
            <li
              key={`${item.url}-${i}`}
              className="flex items-center gap-3 px-3 py-2 hover:bg-neutral-100 cursor-pointer border-b last:border-none"
              onClick={() => handleSuggestionClick(item.embed_url)}
            >
              <img
                src={item.image}
                alt=""
                className="w-10 h-10 rounded object-cover shrink-0"
              />
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{item.title}</div>
                <div className="text-xs text-gray-500 truncate">
                  {item.podcast_name}
                </div>
              </div>
            </li>
          ))}
          <li
            className="px-3 py-2 text-sm text-sky-700 font-semibold hover:bg-neutral-100 cursor-pointer text-center"
            onClick={handleSubmit}
          >
            See all results for &quot;{query}&quot;
          </li>
        </ul>
      )}
    </div>
  );
};
