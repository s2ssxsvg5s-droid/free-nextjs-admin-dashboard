"use client";

import { useSyncExternalStore } from "react";

const MOBILE_BREAKPOINT = 1280; // xl breakpoint — matches TailAdmin sidebar's xl:translate-x-0

const query = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;
const subscribe = (callback: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
const getSnapshot = () => window.matchMedia(query).matches;
const getServerSnapshot = () => false;

export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
