"use client";
import { FrontPage } from "@/components/FrontPage";
import { Navbar } from "@/components/Navbar";
import { useEmbedContext } from "@/context/EmbedContext";

export default function Page({
  params,
}: {
  params: Promise<{ categories: string[] }>;
}) {
  const { currentEmbedUrl, setCurrentEmbedUrl } = useEmbedContext();

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar params={params} />
      <FrontPage
        setCurrentEmbedUrl={setCurrentEmbedUrl}
        currentEmbedUrl={currentEmbedUrl}
      />
    </div>
  );
}
