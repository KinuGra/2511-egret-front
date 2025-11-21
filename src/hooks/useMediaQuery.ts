"use client";

import { useState, useEffect } from 'react';

/**
 * A custom hook for tracking the state of a media query.
 * @param query The media query string to watch.
 * @returns `true` if the media query matches, `false` otherwise.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Set initial value
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => {
      setMatches(media.matches);
    };

    // Add listener for changes
    media.addEventListener('change', listener);

    return () => {
      // Cleanup listener
      media.removeEventListener('change', listener);
    };
  }, [matches, query]);

  return matches;
}
