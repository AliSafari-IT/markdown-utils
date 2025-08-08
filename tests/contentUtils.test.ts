import { describe, it, expect } from 'vitest';
import {
  getFirstHeading,
  getAllHeadings,
  getFirstParagraph,
  extractLinks,
  extractImages,
  stripMarkdown,
  getWordCount,
  getReadingTime
} from '../src/contentUtils';

describe('Content Utils', () => {
  describe('getFirstHeading', () => {
    it('should extract first H1 heading', () => {
      const content = `
# First Heading

## Second Heading

Some content.
      `;
      
      const result = getFirstHeading(content);
      expect(result).toBe('First Heading');
    });

    it('should return empty string if no heading found', () => {
      const content = 'Just some text without headings.';
      const result = getFirstHeading(content);
      expect(result).toBe('');
    });
  });

  describe('getAllHeadings', () => {
    it('should extract all headings', () => {
      const content = `
# Level 1
## Level 2
### Level 3
#### Level 4
      `;
      
      const result = getAllHeadings(content);
      expect(result).toHaveLength(4);
      expect(result[0]).toEqual({
        level: 1,
        text: 'Level 1',
        anchor: 'level-1'
      });
    });

    it('should respect maxLevel parameter', () => {
      const content = `
# Level 1
## Level 2
### Level 3
#### Level 4
      `;
      
      const result = getAllHeadings(content, 2);
      expect(result).toHaveLength(2);
    });
  });

  describe('getFirstParagraph', () => {
    it('should extract first paragraph', () => {
      const content = `
# Heading

This is the first paragraph with some text.

This is the second paragraph.
      `;
      
      const result = getFirstParagraph(content);
      expect(result).toBe('This is the first paragraph with some text.');
    });
  });

  describe('extractLinks', () => {
    it('should extract markdown links', () => {
      const content = 'Check out [Google](https://google.com) and [GitHub](https://github.com).';
      
      const result = extractLinks(content);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        text: 'Google',
        url: 'https://google.com'
      });
    });
  });

  describe('extractImages', () => {
    it('should extract markdown images', () => {
      const content = '![Alt text](image.jpg "Title") and ![Another](image2.png).';
      
      const result = extractImages(content);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        alt: 'Alt text',
        src: 'image.jpg',
        title: 'Title'
      });
    });
  });

  describe('stripMarkdown', () => {
    it('should remove markdown syntax', () => {
      const content = `
# Heading

**Bold text** and *italic text* with [link](url).

- List item
- Another item
      `;
      
      const result = stripMarkdown(content);
      expect(result).not.toContain('#');
      expect(result).not.toContain('**');
      expect(result).not.toContain('*');
      expect(result).not.toContain('[');
      expect(result).toContain('Bold text');
      expect(result).toContain('italic text');
    });
  });

  describe('getWordCount', () => {    it('should count words correctly', () => {
      const content = `
# Heading

This is a test document with exactly ten words here.
      `;
      
      const result = getWordCount(content);
      expect(result).toBe(11); // "Heading" + 10 words = 11 total
    });
  });
  describe('getReadingTime', () => {
    it('should estimate reading time', () => {
      // Create content with approximately 199 words (+ 1 from heading = 200 total)
      const words = Array(199).fill('word').join(' ');
      const content = `# Test\n\n${words}`;
      
      const result = getReadingTime(content);
      expect(result).toBe(1); // Should be 1 minute for 200 words
    });

    it('should handle custom reading speed', () => {
      const words = Array(99).fill('word').join(' '); // 99 + 1 from heading = 100
      const content = `# Test\n\n${words}`;
      
      const result = getReadingTime(content, 100); // 100 words per minute
      expect(result).toBe(1);
    });
  });
});
