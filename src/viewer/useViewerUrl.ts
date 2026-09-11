import { useCallback, useEffect, useState } from "react";
import { siteUrl } from "../lib/urls";
function read() {
  const params = new URLSearchParams(location.search);
  const raw = Number(params.get("slide") || 1);
  return {
    id: params.get("post"),
    index: Number.isFinite(raw) ? Math.max(0, Math.floor(raw) - 1) : 0,
  };
}
export default function useViewerUrl() {
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const update = () => setRoute(read());
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);
  const open = useCallback((id: string) => {
    history.pushState(
      { neicaViewer: true },
      "",
      `${siteUrl()}?post=${encodeURIComponent(id)}&slide=1`,
    );
    setRoute(read());
  }, []);
  const go = useCallback((index: number) => {
    const url = new URL(location.href);
    url.searchParams.set("slide", String(index + 1));
    history.replaceState(history.state, "", url);
    setRoute(read());
  }, []);
  const close = useCallback(() => {
    if (history.state?.neicaViewer) history.back();
    else {
      history.replaceState(null, "", siteUrl());
      setRoute(read());
    }
  }, []);
  return { ...route, open, go, close };
}
