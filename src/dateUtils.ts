/**
 * Date Utilities for Markdown Processing
 */

/**
 * Extracts creation date from markdown content using various date patterns
 * @param content - The markdown content to parse
 * @returns Date object if found, undefined otherwise
 */
export function getCreationDate(content: string): Date | undefined {
  const match: RegExpMatchArray | null = content?.match(
    /(?:\*\*Date:?\*\*|Date:|Created:|Created At:|Created On:|Created Date:|Created Time:|Created At|Created On|Created Date|Created Time|Date | Date Created: | Date Created | Date Created On | Date Created At | Date Created On: | Date Created Time | ) (.+?)(?:\n|$)/m
  );
  
  if (!match) return undefined;
  
  const dateStr = match[1].trim();
  const parsedDate = new Date(dateStr);
  return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
}

/**
 * Extracts update date from markdown content using various update patterns
 * @param content - The markdown content to parse
 * @returns Date object if found, undefined otherwise
 */
export function getUpdateDate(content: string): Date | undefined {
  const match: RegExpMatchArray | null = content?.match(
    /(?:\*\*(?:Updated|Modified|Changed|Last Changed):?\*\*|(?:Updated|Modified|Changed|Last Changed):) (.+?)(?:\n|$)/m
  );
  
  if (!match) return undefined;
  
  const dateStr = match[1].trim();
  // Try parsing both formats: "December 07, 2024" and "10/10/2024, 1:00:00 AM"
  const parsedDate = new Date(dateStr);
  return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
}

/**
 * Extracts update time from content by looking for "updated:" prefix
 * @param content - The markdown content to parse
 * @returns Date object if found, null otherwise
 */
export function getUpdatedTimeFromContent(content: string): Date | null {
  const lines = content.split('\n');
  const updateLine = lines.find(line => line.toLowerCase().startsWith('updated:'));
  
  if (updateLine) {
    const dateMatch: RegExpMatchArray | null = updateLine.match(/updated:\s*(.+)/i);
    if (dateMatch) {
      return new Date(dateMatch[1]);
    }
  }
  
  return null;
}

/**
 * Attempts to extract date from file path patterns
 * @param path - The file path to parse
 * @returns Date object if found, null otherwise
 */
export function getUpdatedTimeFromPath(path: string): Date | null {
  const match: RegExpMatchArray | null = path?.match(/_([a-f0-9]+)$/);
  return match ? new Date(match[1]) : null;
}

/**
 * Gets the most recent date from creation and update dates
 * @param createdAt - Creation date
 * @param updatedAt - Update date
 * @returns The most recent date or undefined if neither exists
 */
export function getMostRecentDate(createdAt?: Date, updatedAt?: Date): Date | undefined {
  if (!createdAt && !updatedAt) return undefined;
  if (!createdAt) return updatedAt;
  if (!updatedAt) return createdAt;
  
  return updatedAt.getTime() > createdAt.getTime() ? updatedAt : createdAt;
}

/**
 * Formats a date for display purposes
 * @param date - Date to format
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export function formatDate(
  date: Date, 
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
): string {
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

/**
 * Calculates time ago from a given date
 * @param date - Date to calculate from
 * @returns Human-readable time ago string
 */
export function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  
  return 'just now';
}
