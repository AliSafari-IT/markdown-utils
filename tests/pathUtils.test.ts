import { describe, it, expect } from 'vitest';
import {
  filenameToTitle,
  extractDateFromPath,
  isMarkdownFile,
  normalizePath,
  getRelativePath,
  groupPathsByDirectory,
  getFileNameWithoutExtension,
  getDirectoryPath,
  filenameToSlug
} from '../src/pathUtils';

describe('Path Utils', () => {
  describe('filenameToSlug', () => {
    it('should generate slug from simple filename', () => {
      const result = filenameToSlug('hello-world.md');
      expect(result).toBe('hello-world');
    });

    it('should handle paths with spaces and special characters', () => {
      const result = filenameToSlug('My Great Article!.md');
      expect(result).toBe('my-great-article');
    });

    it('should handle paths with numbers and dates', () => {
      const result = filenameToSlug('2023-12-01_article.md');
      expect(result).toBe('2023-12-01-article');
    });
  });

  describe('filenameToTitle', () => {
    it('should generate title from simple filename', () => {
      const result = filenameToTitle('hello-world.md');
      expect(result).toBe('Hello World');
    });

    it('should handle paths with underscores and dashes', () => {
      const result = filenameToTitle('my_great-article.md');
      expect(result).toBe('My Great Article');
    });

    it('should handle paths with dates', () => {
      const result = filenameToTitle('2023-12-01_my-article.md');
      expect(result).toBe('My Article');
    });
  });

  describe('extractDateFromPath', () => {
    it('should extract date from filename with YYYY-MM-DD format', () => {
      const result = extractDateFromPath('/content/2023-12-01_article.md');
      expect(result).toEqual(new Date('2023-12-01'));
    });

    it('should return null for paths without dates', () => {
      const result = extractDateFromPath('/content/article.md');
      expect(result).toBeNull();
    });

    it('should handle different date formats', () => {
      const result = extractDateFromPath('/content/2023-12-01-article.md');
      expect(result).toEqual(new Date('2023-12-01'));
    });
  });

  describe('isMarkdownFile', () => {
    it('should return true for .md files', () => {
      expect(isMarkdownFile('article.md')).toBe(true);
    });

    it('should return true for .markdown files', () => {
      expect(isMarkdownFile('article.markdown')).toBe(true);
    });

    it('should return false for other files', () => {
      expect(isMarkdownFile('article.txt')).toBe(false);
      expect(isMarkdownFile('article.html')).toBe(false);
    });

    it('should be case insensitive', () => {
      expect(isMarkdownFile('article.MD')).toBe(true);
      expect(isMarkdownFile('article.MARKDOWN')).toBe(true);
    });
  });

  describe('normalizePath', () => {
    it('should normalize path separators', () => {
      const result = normalizePath('content\\subfolder\\file.md');
      expect(result).toBe('content/subfolder/file.md');
    });

    it('should handle mixed separators', () => {
      const result = normalizePath('content/subfolder\\file.md');
      expect(result).toBe('content/subfolder/file.md');
    });
  });

  describe('getRelativePath', () => {
    it('should calculate relative path correctly', () => {
      const result = getRelativePath('/content/articles/post.md', '/content');
      expect(result).toBe('articles/post.md');
    });

    it('should handle paths without common base', () => {
      const result = getRelativePath('/other/articles/post.md', '/content');
      expect(result).toBe('/other/articles/post.md');
    });
  });

  describe('groupFilesByDirectory', () => {
    it('should group files by their directory', () => {
      const files = [
        '/content/articles/post1.md',
        '/content/articles/post2.md',
        '/content/pages/about.md',
        '/content/pages/contact.md'
      ];

      const result = groupPathsByDirectory(files);
      expect(result).toEqual({
        '/content/articles': ['/content/articles/post1.md', '/content/articles/post2.md'],
        '/content/pages': ['/content/pages/about.md', '/content/pages/contact.md']
      });
    });

    it('should handle single files', () => {
      const files = ['/content/single.md'];
      const result = groupPathsByDirectory(files);
      expect(result).toEqual({
        '/content': ['/content/single.md']
      });
    });
  });
});
