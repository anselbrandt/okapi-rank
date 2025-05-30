"use client";
import { Navbar } from "@/components/Navbar";
import { FrontPage } from "@/components/FrontPage";
import { useEmbedContext } from "@/context/EmbedContext";

export default function Page() {
  const { currentEmbedUrl, setCurrentEmbedUrl } = useEmbedContext();

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar params={{ categories: [] }} />
      <FrontPage
        setCurrentEmbedUrl={setCurrentEmbedUrl}
        currentEmbedUrl={currentEmbedUrl}
      />
    </div>
  );
}
