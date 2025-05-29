"use client";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Feed } from "@/components/Feed";
import { useEmbedContext } from "@/context/EmbedContext";

export default function Page() {
  const params = useParams<{ categories?: string[] }>();
  const section = params?.categories?.[1]
    ? `${params?.categories?.[0]}/${params?.categories?.[1]}`
    : `${params?.categories?.[0]}/${params?.categories?.[0]}`;
  const { currentEmbedUrl, setCurrentEmbedUrl } = useEmbedContext();

  return (
    <div className="min-h-screen bg-neutral-50 overflow-x-hidden">
      <Navbar />
      <Feed
        section={section}
        setCurrentEmbedUrl={setCurrentEmbedUrl}
        currentEmbedUrl={currentEmbedUrl}
      />
    </div>
  );
}
