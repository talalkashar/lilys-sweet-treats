"use client";

import { useEffect } from "react";

/** Bump this when a deploy must replace a cached/old visit. */
const SITE_VERSION = "2026-08-14-3";
const COOKIE = "lst_site_v";
const RELOAD_FLAG = "lst-fresh";

function readCookie(name: string) {
  const row = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${name}=`));
  return row ? decodeURIComponent(row.slice(name.length + 1)) : "";
}

function writeVersionCookie() {
  document.cookie = `${COOKIE}=${encodeURIComponent(SITE_VERSION)}; path=/; max-age=31536000; SameSite=Lax`;
}

function refreshIfStale() {
  const seen = readCookie(COOKIE);
  if (seen === SITE_VERSION) return;
  writeVersionCookie();
  if (!seen) return;
  try {
    if (sessionStorage.getItem(RELOAD_FLAG) === SITE_VERSION) return;
    sessionStorage.setItem(RELOAD_FLAG, SITE_VERSION);
  } catch {
    /* still reload once */
  }
  window.location.reload();
}

/** Reloads once when an older visit cookie is present. */
export function ForceFresh() {
  useEffect(() => {
    refreshIfStale();
    const onShow = (event: PageTransitionEvent) => {
      if (event.persisted) refreshIfStale();
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);
  return null;
}
