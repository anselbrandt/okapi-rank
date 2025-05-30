"use client";

import { Feed } from "@/components/Feed";
import { useEmbedContext } from "@/context/EmbedContext";

type Props = {
  section: string;
};

export function FeedWrapper({ section }: Props) {
  const { currentEmbedUrl, setCurrentEmbedUrl } = useEmbedContext();

  return (
    <Feed
      section={section}
      currentEmbedUrl={currentEmbedUrl}
      setCurrentEmbedUrl={setCurrentEmbedUrl}
    />
  );
}
