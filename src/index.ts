/**
 * @asafarim/markdown-utils
 * 
 * A comprehensive collection of utility functions for markdown processing,
 * metadata extraction, content parsing, and validation.
 * 
 * @author Ali Safari <asafarim@gmail.com>
 * @version 1.0.0
 */

// Date utilities
export {
  getCreationDate,
  getUpdateDate,
  getUpdatedTimeFromContent,
  getUpdatedTimeFromPath,
  getMostRecentDate,
  formatDate,
  getTimeAgo
} from './dateUtils';

// Content parsing utilities
export {
  getFirstHeading,
  getAllHeadings,
  getFirstParagraph,
  extractLinks,
  extractImages,
  extractCodeBlocks,
  stripMarkdown,
  getWordCount,
  getReadingTime,
  markdownToHtml
} from './contentUtils';

// Path and file utilities
export {
  getGitHash,
  getFileNameWithoutExtension,
  getDirectoryPath,
  getRelativePath,
  filenameToSlug,
  filenameToTitle,
  sortPathsByDate,
  extractDateFromPath,
  groupPathsByDirectory,
  isMarkdownFile,
  normalizePath
} from './pathUtils';

// Validation utilities
export {
  isValidMarkdown,
  validateFrontmatter,
  validateMarkdownLinks,
  validateMarkdownImages,
  validateMarkdownTables,
  validateMarkdown
} from './validationUtils';

// Import all utilities for default export
import * as dateUtils from './dateUtils';
import * as contentUtils from './contentUtils';
import * as pathUtils from './pathUtils';
import * as validationUtils from './validationUtils';

// Type definitions for better TypeScript support
export interface MarkdownHeading {
  level: number;
  text: string;
  anchor: string;
}

export interface MarkdownLink {
  text: string;
  url: string;
}

export interface MarkdownImage {
  alt: string;
  src: string;
  title?: string;
}

export interface MarkdownCodeBlock {
  language: string;
  content: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface LinkValidationResult extends MarkdownLink, ValidationResult {}

export interface ImageValidationResult extends MarkdownImage, ValidationResult {}

export interface TableValidationResult extends ValidationResult {
  lineNumber: number;
}

export interface FrontmatterValidationResult extends ValidationResult {
  frontmatter?: Record<string, any>;
  content?: string;
}

export interface MarkdownValidationReport {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    wordCount: number;
    headingCount: number;
    linkCount: number;
    imageCount: number;
  };
}

// Default export with all utilities grouped
export default {
  // Date utilities
  date: dateUtils,
  
  // Content utilities
  content: contentUtils,
  
  // Path utilities
  path: pathUtils,
  
  // Validation utilities
  validation: validationUtils
};
