import { describe, it, expect } from 'vitest';
import { calculateStreaks, daysBetween, subtractOneDay } from '../src/utils/streaks';

describe('Streak Calculation Utility', () => {
  describe('daysBetween', () => {
    it('should calculate days between consecutive dates', () => {
      expect(daysBetween('2024-01-01', '2024-01-02')).toBe(1);
      expect(daysBetween('2024-01-01', '2024-01-03')).toBe(2);
    });

    it('should handle same-day calculation', () => {
      expect(daysBetween('2024-01-01', '2024-01-01')).toBe(0);
    });

    it('should work with reversed dates', () => {
      expect(daysBetween('2024-01-02', '2024-01-01')).toBe(1);
    });

    it('should calculate days across months', () => {
      expect(daysBetween('2024-01-31', '2024-02-01')).toBe(1);
    });

    it('should calculate days across years', () => {
      expect(daysBetween('2024-12-31', '2025-01-01')).toBe(1);
    });
  });

  describe('subtractOneDay', () => {
    it('should subtract one day from a date', () => {
      expect(subtractOneDay('2024-01-02')).toBe('2024-01-01');
    });

    it('should handle month boundary', () => {
      expect(subtractOneDay('2024-02-01')).toBe('2024-01-31');
    });

    it('should handle year boundary', () => {
      expect(subtractOneDay('2024-01-01')).toBe('2023-12-31');
    });

    it('should handle leap year', () => {
      expect(subtractOneDay('2024-03-01')).toBe('2024-02-29');
    });
  });

  describe('calculateStreaks', () => {
    it('should return zeros for empty dates', () => {
      const result = calculateStreaks([], '2024-05-30');
      expect(result).toEqual({ current: 0, best: 0, total: 0 });
    });

    it('should handle single check-in on today', () => {
      const result = calculateStreaks(['2024-05-30'], '2024-05-30');
      expect(result).toEqual({ current: 1, best: 1, total: 1 });
    });

    it('should handle single check-in not on today', () => {
      const result = calculateStreaks(['2024-05-29'], '2024-05-30');
      expect(result).toEqual({ current: 0, best: 1, total: 1 });
    });

    it('should calculate consecutive streak ending today', () => {
      const dates = ['2024-05-28', '2024-05-29', '2024-05-30'];
      const result = calculateStreaks(dates, '2024-05-30');
      expect(result).toEqual({ current: 3, best: 3, total: 3 });
    });

    it('should calculate current streak when gap exists', () => {
      // Consecutive streak is 3 (May 28-30), best is also 3
      const dates = ['2024-05-25', '2024-05-26', '2024-05-28', '2024-05-29', '2024-05-30'];
      const result = calculateStreaks(dates, '2024-05-30');
      expect(result).toEqual({ current: 3, best: 3, total: 5 });
    });

    it('should calculate best streak correctly', () => {
      // Best streak is 4 (May 10-13), current is 2 (May 29-30)
      const dates = [
        '2024-05-10',
        '2024-05-11',
        '2024-05-12',
        '2024-05-13',
        '2024-05-29',
        '2024-05-30',
      ];
      const result = calculateStreaks(dates, '2024-05-30');
      expect(result).toEqual({ current: 2, best: 4, total: 6 });
    });

    it('should handle unsorted dates', () => {
      const dates = ['2024-05-30', '2024-05-28', '2024-05-29'];
      const result = calculateStreaks(dates, '2024-05-30');
      expect(result).toEqual({ current: 3, best: 3, total: 3 });
    });

    it('should handle duplicate dates', () => {
      const dates = ['2024-05-28', '2024-05-29', '2024-05-29', '2024-05-30', '2024-05-30'];
      const result = calculateStreaks(dates, '2024-05-30');
      expect(result).toEqual({ current: 3, best: 3, total: 3 });
    });

    it('should calculate 7-day streak', () => {
      const dates = [
        '2024-05-24',
        '2024-05-25',
        '2024-05-26',
        '2024-05-27',
        '2024-05-28',
        '2024-05-29',
        '2024-05-30',
      ];
      const result = calculateStreaks(dates, '2024-05-30');
      expect(result).toEqual({ current: 7, best: 7, total: 7 });
    });

    it('should calculate 30-day streak', () => {
      const dates = [];
      for (let i = 0; i < 30; i++) {
        const date = new Date('2024-05-01');
        date.setUTCDate(date.getUTCDate() + i);
        dates.push(date.toISOString().slice(0, 10));
      }
      const result = calculateStreaks(dates, '2024-05-30');
      expect(result).toEqual({ current: 30, best: 30, total: 30 });
    });

    it('should break streak if today is missing', () => {
      // Streak from May 27-29, today is May 30 but no checkin
      const dates = ['2024-05-27', '2024-05-28', '2024-05-29'];
      const result = calculateStreaks(dates, '2024-05-30');
      expect(result).toEqual({ current: 0, best: 3, total: 3 });
    });

    it('should handle multiple non-consecutive streaks', () => {
      // First streak: 3 days (May 5-7)
      // Second streak: 2 days (May 15-16)
      // Third streak: 1 day (May 29), current is 0 because May 30 missing
      const dates = [
        '2024-05-05',
        '2024-05-06',
        '2024-05-07',
        '2024-05-15',
        '2024-05-16',
        '2024-05-29',
      ];
      const result = calculateStreaks(dates, '2024-05-30');
      expect(result).toEqual({ current: 0, best: 3, total: 6 });
    });

    it('should maintain correct total count', () => {
      const dates = ['2024-01-01', '2024-01-05', '2024-01-10'];
      const result = calculateStreaks(dates, '2024-05-30');
      expect(result.total).toBe(3);
    });
  });
});
