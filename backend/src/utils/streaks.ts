/**
 * Calculate streaks for a habit based on checkin dates.
 * Pure function with no side effects.
 */

/**
 * Calculate days between two YYYY-MM-DD dates.
 * Returns positive integer if date2 is after date1.
 */
export function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Subtract one day from a YYYY-MM-DD date string.
 * Returns the date in YYYY-MM-DD format.
 */
export function subtractOneDay(date: string): string {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

export interface StreakStats {
  current: number;
  best: number;
  total: number;
}

/**
 * Calculate streak statistics for a habit.
 *
 * @param dates - Array of 'YYYY-MM-DD' strings (may be unsorted/duplicated)
 * @param todayISO - UTC date as 'YYYY-MM-DD' string
 * @returns Object with current, best, and total streak counts
 */
export function calculateStreaks(
  dates: string[],
  todayISO: string
): StreakStats {
  // Deduplicate and sort dates
  const sorted = [...new Set(dates)].sort();

  if (sorted.length === 0) {
    return { current: 0, best: 0, total: 0 };
  }

  // Calculate best streak by walking through sorted dates
  let best = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const diff = daysBetween(sorted[i - 1], sorted[i]);
    run = diff === 1 ? run + 1 : 1;
    best = Math.max(best, run);
  }

  // Calculate current streak by walking backwards from today
  let current = 0;
  const dateSet = new Set(sorted);
  let day = todayISO;

  while (dateSet.has(day)) {
    current++;
    day = subtractOneDay(day);
  }

  return {
    current,
    best,
    total: sorted.length,
  };
}
