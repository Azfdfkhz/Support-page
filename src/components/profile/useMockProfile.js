"use client";

import { useMemo, useSyncExternalStore } from "react";
import { USE_MOCKS } from "@/lib/config";
import { parseMockProfile, readMockProfileRaw, subscribeMockProfile } from "@/lib/mockProfileStore";

const subscribeNothing = () => () => {};

/**
 * Demo mode only: the profile created in this browser for `slug`.
 * Returns undefined while the browser value has not been read yet (first render), null when there
 * is none, and always null outside demo mode, so real deployments render immediately.
 */
export function useMockProfile(slug) {
  const raw = useSyncExternalStore(
    USE_MOCKS ? subscribeMockProfile : subscribeNothing,
    () => (USE_MOCKS ? readMockProfileRaw(slug) : null),
    () => (USE_MOCKS ? undefined : null),
  );
  return useMemo(() => (raw === undefined ? undefined : parseMockProfile(raw)), [raw]);
}
