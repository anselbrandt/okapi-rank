import { useState, useRef, useCallback, useEffect } from "react";
import { create, insert, search } from "@orama/orama";
import type { Orama, Results } from "@orama/orama";
import { NEXT_PUBLIC_CDN_URL } from "@/constants";

type IndexEntry = {
  t: string;
  p: string;
  s: string;
  u: string;
  e: string;
  i: string;
  d: string;
  r: string;
  sc: number;
};

export type SearchResult = {
  title: string;
  podcast_name: string;
  summary: string;
  url: string;
  embed_url: string;
  image: string;
  duration: string;
  release_date: string;
  score: number;
};

let db: Orama<any> | null = null;
let dbPromise: Promise<Orama<any>> | null = null;

async function initIndex(): Promise<Orama<any>> {
  if (db) return db;
  if (dbPromise) return dbPromise;

  dbPromise = (async () => {
    const res = await fetch(`${NEXT_PUBLIC_CDN_URL}/search/index.json`, {
      cache: "no-store",
    });
    const data: IndexEntry[] = await res.json();

    const instance = await create({
      schema: {
        t: "string",
        p: "string",
        s: "string",
        u: "string",
        e: "string",
        i: "string",
        d: "string",
        r: "string",
        sc: "number",
      },
    });

    for (const entry of data) {
      await insert(instance, entry);
    }

    db = instance;
    return instance;
  })();

  return dbPromise;
}

function mapResults(results: Results<any>): SearchResult[] {
  return results.hits.map((hit) => ({
    title: hit.document.t,
    podcast_name: hit.document.p,
    summary: hit.document.s,
    url: hit.document.u,
    embed_url: hit.document.e,
    image: hit.document.i,
    duration: hit.document.d,
    release_date: hit.document.r,
    score: hit.document.sc,
  }));
}

export function useSearch() {
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [indexReady, setIndexReady] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadIndex = useCallback(async () => {
    if (db) {
      setIndexReady(true);
      return;
    }
    try {
      await initIndex();
      setIndexReady(true);
    } catch (err) {
      console.error("Failed to load search index:", err);
    }
  }, []);

  const onQueryChange = useCallback((term: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!term.trim()) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      if (!db) return;
      const results = await search(db, {
        term,
        properties: ["t", "p", "s"],
        limit: 8,
      });
      setSuggestions(mapResults(results));
    }, 150);
  }, []);

  const fullSearch = useCallback(async (term: string) => {
    setLoading(true);
    try {
      const instance = await initIndex();
      const results = await search(instance, {
        term,
        properties: ["t", "p", "s"],
        limit: 100,
      });
      setResults(mapResults(results));
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    suggestions,
    results,
    loading,
    indexReady,
    loadIndex,
    onQueryChange,
    fullSearch,
    setSuggestions,
  };
}
