/**
 * Calculate days between two YYYY-MM-DD date strings
 */
export function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1 + 'T00:00:00Z');
  const d2 = new Date(date2 + 'T00:00:00Z');
  const diffMs = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Subtract one day from a YYYY-MM-DD date string
 */
export function subtractOneDay(date: string): string {
  const d = new Date(date + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

export interface StreakResult {
  current: number;
  best: number;
  total: number;
}

/**
 * Calculate current streak, best streak, and total checkins
 * @param dates - array of 'YYYY-MM-DD' strings (may be unsorted)
 * @param todayISO - UTC date string 'YYYY-MM-DD' (caller passes new Date().toISOString().slice(0, 10))
 */
export function calculateStreaks(
  dates: string[],
  todayISO: string
): StreakResult {
  const sorted = [...new Set(dates)].sort();

  if (sorted.length === 0) {
    return { current: 0, best: 0, total: 0 };
  }

  // Calculate best streak
  let best = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const diff = daysBetween(sorted[i - 1], sorted[i]);
    run = diff === 1 ? run + 1 : 1;
    best = Math.max(best, run);
  }

  // Calculate current streak - walk backwards from today
  let current = 0;
  const dateSet = new Set(sorted);
  let day = todayISO;
  while (dateSet.has(day)) {
    current++;
    day = subtractOneDay(day);
  }

  return { current, best, total: sorted.length };
}
