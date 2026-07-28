"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * `false` during SSR and the first client render, `true` afterwards.
 *
 * Use it to gate anything read from persisted client state (the cart) so the
 * server HTML and the hydration pass agree. Unlike a `useEffect(setState)`
 * flag this needs no extra render pass and no cascading-render lint suppression.
 */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
