"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type EmbedContextType = {
  currentEmbedUrl: string | null;
  setCurrentEmbedUrl: (url: string | null) => void;
};

const EmbedContext = createContext<EmbedContextType | undefined>(undefined);

export function EmbedProvider({ children }: { children: ReactNode }) {
  const [currentEmbedUrl, setCurrentEmbedUrl] = useState<string | null>(null);

  return (
    <EmbedContext.Provider value={{ currentEmbedUrl, setCurrentEmbedUrl }}>
      {children}
    </EmbedContext.Provider>
  );
}

export function useEmbedContext() {
  const context = useContext(EmbedContext);
  if (!context) {
    throw new Error("useEmbedContext must be used within an EmbedProvider");
  }
  return context;
}
