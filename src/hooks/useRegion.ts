import { useEffect, useState } from "react";

export type Region = "us-ca" | "other";

/**
 * Best-effort, network-free region guess used purely to decide which contact
 * number to show. It never calls an external geo-IP service (no request,
 * no consent prompt) — it reads the browser's own timezone and locale,
 * which is a reasonable proxy and fails safe to "other" (India default).
 */
function guessRegion(): Region {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const locale = navigator.language || "";
    const tzHit = tz.startsWith("America/") && !tz.startsWith("America/Sao") && !tz.startsWith("America/Argentina") && !tz.startsWith("America/Bogota") && !tz.startsWith("America/Lima") && !tz.startsWith("America/Santiago") && !tz.startsWith("America/Mexico");
    const localeHit = /-(US|CA)$/i.test(locale);
    return tzHit || localeHit ? "us-ca" : "other";
  } catch {
    return "other";
  }
}

export function useRegion(): Region {
  const [region, setRegion] = useState<Region>("other");
  useEffect(() => {
    setRegion(guessRegion());
  }, []);
  return region;
}
