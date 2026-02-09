/**
 * Returns a function that calculates elapsed time in milliseconds
 * since the timer was created.
 */
export function getElapsedTime(): () => number {
  const start = performance.now();
  return () => Math.round(performance.now() - start);
}
