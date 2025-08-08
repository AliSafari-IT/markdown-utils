/**
 * Path and File Utilities for Markdown Processing
 */

/**
 * Extracts git hash from file path patterns
 * @param path - The file path to parse
 * @returns Git hash string or '-' if none found
 */
export function getGitHash(path: string): string {
  const match: RegExpMatchArray | null = path?.match(/_([a-f0-9]+)$/);
  return (match as RegExpMatchArray | null)?.[1] ?? '-';
}

/**
 * Extracts filename from a file path without extension
 * @param filePath - The file path to parse
 * @returns Filename without extension
 */
export function getFileNameWithoutExtension(filePath: string): string {
  const filename = filePath.split('/').pop() || filePath.split('\\').pop() || '';
  return filename.replace(/\.[^/.]+$/, '');
}

/**
 * Extracts the directory path from a file path
 * @param filePath - The file path to parse
 * @returns Directory path
 */
export function getDirectoryPath(filePath: string): string {
  const parts = filePath.replace(/\\/g, '/').split('/');
  parts.pop(); // Remove filename
  return parts.join('/');
}

/**
 * Extracts the relative path from a full path based on a base folder
 * @param filePath - The full file path
 * @param baseFolderName - The base folder name to extract relative path from
 * @returns Relative path from the base folder
 */
export function getRelativePath(filePath: string, baseFolderName: string): string {
  const normalizedPath = filePath.replace(/\\/g, '/');
  const normalizedBase = baseFolderName.replace(/\\/g, '/');
  
  // If the path starts with the base folder, remove it
  if (normalizedPath.startsWith(normalizedBase)) {
    return normalizedPath.substring(normalizedBase.length).replace(/^\//, '');
  }
  
  // If the base folder is found within the path, extract relative part
  const regex = new RegExp(`^.*?${normalizedBase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/`);
  const relativePath = normalizedPath.replace(regex, '');
  
  // Return the original path if no match found (don't remove .md extension)
  return relativePath || normalizedPath;
}

/**
 * Converts a filename to a URL-friendly slug
 * @param filename - The filename to convert
 * @returns URL-friendly slug
 */
export function filenameToSlug(filename: string): string {
  return filename
    .replace(/\.[^/.]+$/, '') // Remove extension first
    .toLowerCase()
    .replace(/_/g, '-') // Replace underscores with hyphens
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

/**
 * Converts a filename to a human-readable title
 * @param filename - The filename to convert
 * @returns Human-readable title
 */
export function filenameToTitle(filename: string): string {
  return filename
    .replace(/\.[^/.]+$/, '') // Remove extension first
    .replace(/^\d{4}-\d{2}-\d{2}[_-]?/, '') // Remove date prefix (YYYY-MM-DD)
    .replace(/-/g, ' ') // Replace hyphens with spaces
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/\b\w/g, l => l.toUpperCase()) // Capitalize first letter of each word
    .trim();
}

/**
 * Sorts file paths by modification date (extracted from filename patterns)
 * @param paths - Array of file paths
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array of file paths
 */
export function sortPathsByDate(paths: string[], order: 'asc' | 'desc' = 'desc'): string[] {
  return paths.sort((a, b) => {
    const dateA = extractDateFromPath(a);
    const dateB = extractDateFromPath(b);
    
    if (!dateA && !dateB) return 0;
    if (!dateA) return order === 'desc' ? 1 : -1;
    if (!dateB) return order === 'desc' ? -1 : 1;
    
    const timeA = dateA.getTime();
    const timeB = dateB.getTime();
    
    return order === 'desc' ? timeB - timeA : timeA - timeB;
  });
}

/**
 * Attempts to extract date from various filename patterns
 * @param path - File path to analyze
 * @returns Date object if found, null otherwise
 */
export function extractDateFromPath(path: string): Date | null {
  const filename = getFileNameWithoutExtension(path);
  
  // Try different date patterns
  const patterns = [
    /(\d{4}-\d{2}-\d{2})/, // YYYY-MM-DD
    /(\d{4}_\d{2}_\d{2})/, // YYYY_MM_DD
    /(\d{8})/, // YYYYMMDD
    /(\d{2}-\d{2}-\d{4})/, // MM-DD-YYYY
    /(\d{2}_\d{2}_\d{4})/, // MM_DD_YYYY
  ];
  
  for (const pattern of patterns) {
    const match = filename.match(pattern);
    if (match) {
      const dateStr = match[1].replace(/_/g, '-');
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  }
  
  return null;
}

/**
 * Groups file paths by their directory structure
 * @param paths - Array of file paths
 * @returns Object with directory paths as keys and file arrays as values
 */
export function groupPathsByDirectory(paths: string[]): Record<string, string[]> {
  const groups: Record<string, string[]> = {};
  
  for (const path of paths) {
    const directory = getDirectoryPath(path) || 'root';
    if (!groups[directory]) {
      groups[directory] = [];
    }
    groups[directory].push(path);
  }
  
  return groups;
}

/**
 * Checks if a path represents a markdown file
 * @param path - File path to check
 * @returns True if the path is a markdown file
 */
export function isMarkdownFile(path: string): boolean {
  return /\.(md|markdown)$/i.test(path);
}

/**
 * Normalizes path separators to forward slashes
 * @param path - Path to normalize
 * @returns Normalized path with forward slashes
 */
export function normalizePath(path: string): string {
  return path.replace(/\\/g, '/');
}
