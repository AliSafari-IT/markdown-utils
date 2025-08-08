import { describe, it, expect } from 'vitest';
import {
  getCreationDate,
  getUpdateDate,
  getMostRecentDate,
  formatDate,
  getTimeAgo
} from '../src/dateUtils';

describe('Date Utils', () => {
  describe('getCreationDate', () => {
    it('should extract creation date from markdown content', () => {
      const content = `
# Test Document

Date: December 07, 2024

Some content here.
      `;
      
      const result = getCreationDate(content);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(11); // December is month 11 (0-indexed)
    });

    it('should return undefined for content without date', () => {
      const content = `
# Test Document

Some content without date.
      `;
      
      const result = getCreationDate(content);
      expect(result).toBeUndefined();
    });

    it('should handle different date formats', () => {
      const content1 = 'Created: 2024-12-07';
      const content2 = '**Date:** December 07, 2024';
      const content3 = 'Created At: 12/07/2024';
      
      expect(getCreationDate(content1)).toBeInstanceOf(Date);
      expect(getCreationDate(content2)).toBeInstanceOf(Date);
      expect(getCreationDate(content3)).toBeInstanceOf(Date);
    });
  });

  describe('getUpdateDate', () => {
    it('should extract update date from markdown content', () => {
      const content = `
# Test Document

Updated: December 08, 2024

Some content here.
      `;
      
      const result = getUpdateDate(content);
      expect(result).toBeInstanceOf(Date);
    });

    it('should handle different update patterns', () => {
      const content1 = 'Modified: 2024-12-08';
      const content2 = '**Updated:** December 08, 2024';
      const content3 = 'Last Changed: 12/08/2024';
      
      expect(getUpdateDate(content1)).toBeInstanceOf(Date);
      expect(getUpdateDate(content2)).toBeInstanceOf(Date);
      expect(getUpdateDate(content3)).toBeInstanceOf(Date);
    });
  });

  describe('getMostRecentDate', () => {
    it('should return the most recent date', () => {
      const created = new Date('2024-12-07');
      const updated = new Date('2024-12-08');
      
      const result = getMostRecentDate(created, updated);
      expect(result).toBe(updated);
    });

    it('should handle missing dates', () => {
      const created = new Date('2024-12-07');
      
      expect(getMostRecentDate(created, undefined)).toBe(created);
      expect(getMostRecentDate(undefined, created)).toBe(created);
      expect(getMostRecentDate(undefined, undefined)).toBeUndefined();
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-12-07');
      const result = formatDate(date);
      
      expect(result).toMatch(/Dec/);
      expect(result).toMatch(/2024/);
    });
  });

  describe('getTimeAgo', () => {
    it('should calculate time ago correctly', () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      expect(getTimeAgo(oneHourAgo)).toMatch(/hour/);
      expect(getTimeAgo(oneDayAgo)).toMatch(/day/);
    });

    it('should handle recent times', () => {
      const now = new Date();
      const justNow = new Date(now.getTime() - 30 * 1000); // 30 seconds ago
      
      expect(getTimeAgo(justNow)).toBe('just now');
    });
  });
});
