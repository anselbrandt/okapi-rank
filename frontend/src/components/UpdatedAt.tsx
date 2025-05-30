"use client";

import { useEffect, useState } from "react";

export function UpdatedAt({ isoTime }: { isoTime: string }) {
  const [timeString, setTimeString] = useState("");

  useEffect(() => {
    const date = new Date(isoTime);
    const localTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    setTimeString(localTime);
  }, [isoTime]);

  return <>{timeString && `Updated at ${timeString}`}</>;
}
