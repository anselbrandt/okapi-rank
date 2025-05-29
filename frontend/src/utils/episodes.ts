import { parseISO } from "date-fns";

export function removeEmojis(text: string | undefined) {
  return text?.replace(/[\p{Emoji}\p{Extended_Pictographic}]/gu, "") || "";
}

export function formatDuration(duration: string) {
  const seconds = parseInt(duration, 10);
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
}

export function toEmbedUrl(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("podcasts.apple.com")) {
      return `https://embed.podcasts.apple.com${u.pathname}?${u.searchParams}`;
    }
  } catch {}
  return url;
}

export function makeIdFromUrl(url: string) {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = (hash << 5) - hash + url.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString();
}

export function formatTime(isoString: string): string {
  try {
    const date = parseISO(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 60) {
      return `${diffMins}M AGO`;
    }

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return `${diffHours}H AGO`;
    }

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}D AGO`;
  } catch {
    return "Unknown";
  }
}
