import { QueryClient } from "@tanstack/react-query";

/**
 * Shared QueryClient instance for the entire app.
 *
 * Cache strategy:
 * - staleTime (2 min): Data is considered "fresh" for 2 minutes.
 *   During this window, navigating back to a page shows cached data
 *   WITHOUT any refetch — no spinner, no network request.
 *
 * - gcTime (10 min): Cached data is garbage-collected 10 minutes after
 *   the last component using it unmounts. This means if a user leaves
 *   a page and comes back within 10 minutes, the data is still there.
 *
 * - refetchOnWindowFocus: When the user tabs back to the app, stale
 *   queries automatically refresh in the background.
 *
 * - retry: 1: Failed requests get one retry before showing an error.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,       // 2 minutes
      gcTime: 10 * 60 * 1000,          // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 1,
    },
  },
});
