/**
 * Validation Utilities for Markdown Processing
 */

/**
 * Validates if a string contains valid markdown content
 * @param content - Content to validate
 * @returns True if content appears to be valid markdown
 */
export function isValidMarkdown(content: string): boolean {
  if (!content || typeof content !== 'string') return false;
  
  // Basic checks for markdown-like content
  const hasHeadings = /^#{1,6}\s+.+$/m.test(content);
  const hasText = content.trim().length > 0;
  const hasMarkdownSyntax = /(\*\*.*\*\*|\*.*\*|`.*`|\[.*\]\(.*\)|^[-*+]\s+)/m.test(content);
  
  return hasText && (hasHeadings || hasMarkdownSyntax || content.length > 10);
}

/**
 * Validates markdown frontmatter (YAML)
 * @param content - Markdown content with potential frontmatter
 * @returns Object with validation result and extracted frontmatter
 */
export function validateFrontmatter(content: string): {
  isValid: boolean;
  frontmatter?: Record<string, any>;
  content?: string;
  error?: string;
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { isValid: true, content }; // No frontmatter is valid
  }
  
  try {
    const frontmatterText = match[1];
    const markdownContent = match[2];
    
    // Basic YAML validation (simplified)
    const frontmatter: Record<string, any> = {};
    const lines = frontmatterText.split('\n');
    
    for (const line of lines) {
      if (line.trim() === '') continue;
      
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) continue;
      
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      
      // Remove quotes if present
      const cleanValue = value.replace(/^["']|["']$/g, '');
      frontmatter[key] = cleanValue;
    }
    
    return {
      isValid: true,
      frontmatter,
      content: markdownContent
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Invalid frontmatter'
    };
  }
}

/**
 * Validates markdown links to ensure they're properly formatted
 * @param content - Markdown content to validate
 * @returns Array of validation results for each link
 */
export function validateMarkdownLinks(content: string): Array<{
  text: string;
  url: string;
  isValid: boolean;
  error?: string;
}> {
  const linkRegex = /\[([^\]]*)\]\(([^)]*)\)/g;
  const results: Array<{ text: string; url: string; isValid: boolean; error?: string }> = [];
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    const text = match[1];
    const url = match[2];
    
    let isValid = true;
    let error: string | undefined;
    
    // Basic URL validation
    if (!url || url.trim() === '') {
      isValid = false;
      error = 'Empty URL';    } else if (url.startsWith('http://') || url.startsWith('https://')) {
      // External URL - basic format check
      try {
        const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
        if (!urlPattern.test(url)) {
          isValid = false;
          error = 'Invalid URL format';
        }
      } catch {
        isValid = false;
        error = 'Invalid URL format';
      }
    } else if (url.startsWith('#')) {
      // Anchor link - should not be empty after #
      if (url.length === 1) {
        isValid = false;
        error = 'Empty anchor';
      }
    } else if (url.startsWith('/') || url.includes('.')) {
      // Relative path - basic format check
      if (url.includes('..') && url.includes('./')) {
        isValid = false;
        error = 'Potentially unsafe relative path';
      }
    }
    
    results.push({ text, url, isValid, error });
  }
  
  return results;
}

/**
 * Validates markdown images to ensure they're properly formatted
 * @param content - Markdown content to validate
 * @returns Array of validation results for each image
 */
export function validateMarkdownImages(content: string): Array<{
  alt: string;
  src: string;
  isValid: boolean;
  error?: string;
}> {
  const imageRegex = /!\[([^\]]*)\]\(([^)]*)\)/g;
  const results: Array<{ alt: string; src: string; isValid: boolean; error?: string }> = [];
  let match;
  
  while ((match = imageRegex.exec(content)) !== null) {
    const alt = match[1];
    const src = match[2];
    
    let isValid = true;
    let error: string | undefined;
    
    // Alt text validation
    if (!alt || alt.trim() === '') {
      isValid = false;
      error = 'Missing alt text';
    }
    
    // Source validation
    if (!src || src.trim() === '') {
      isValid = false;
      error = 'Missing image source';    } else if (src.startsWith('http://') || src.startsWith('https://')) {
      const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
      if (!urlPattern.test(src)) {
        isValid = false;
        error = 'Invalid image URL format';
      }
    }
    
    results.push({ alt, src, isValid, error });
  }
  
  return results;
}

/**
 * Validates markdown table syntax
 * @param content - Markdown content to validate
 * @returns Array of validation results for each table
 */
export function validateMarkdownTables(content: string): Array<{
  lineNumber: number;
  isValid: boolean;
  error?: string;
}> {
  const lines = content.split('\n');
  const results: Array<{ lineNumber: number; isValid: boolean; error?: string }> = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check for table separator line
    if (/^\|?[\s]*:?-+:?[\s]*\|/.test(line)) {
      const headerLine = i > 0 ? lines[i - 1].trim() : '';
      
      if (!headerLine || !headerLine.includes('|')) {
        results.push({
          lineNumber: i + 1,
          isValid: false,
          error: 'Table separator without header row'
        });
        continue;
      }
      
      // Count columns in header and separator
      const headerCols = headerLine.split('|').filter(cell => cell.trim() !== '').length;
      const separatorCols = line.split('|').filter(cell => cell.trim() !== '').length;
      
      if (headerCols !== separatorCols) {
        results.push({
          lineNumber: i + 1,
          isValid: false,
          error: `Column count mismatch: header has ${headerCols}, separator has ${separatorCols}`
        });
      } else {
        results.push({
          lineNumber: i + 1,
          isValid: true
        });
      }
    }
  }
  
  return results;
}

/**
 * Performs comprehensive validation of markdown content
 * @param content - Markdown content to validate
 * @returns Complete validation report
 */
export function validateMarkdown(content: string): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    wordCount: number;
    headingCount: number;
    linkCount: number;
    imageCount: number;
  };
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Basic content validation
  if (!isValidMarkdown(content)) {
    errors.push('Content does not appear to be valid markdown');
  }
  
  // Frontmatter validation
  const frontmatterResult = validateFrontmatter(content);
  if (!frontmatterResult.isValid) {
    errors.push(`Frontmatter error: ${frontmatterResult.error}`);
  }
  
  // Link validation
  const linkResults = validateMarkdownLinks(content);
  linkResults.forEach(result => {
    if (!result.isValid) {
      warnings.push(`Invalid link "${result.text}": ${result.error}`);
    }
  });
  
  // Image validation
  const imageResults = validateMarkdownImages(content);
  imageResults.forEach(result => {
    if (!result.isValid) {
      warnings.push(`Invalid image "${result.alt}": ${result.error}`);
    }
  });
  
  // Table validation
  const tableResults = validateMarkdownTables(content);
  tableResults.forEach(result => {
    if (!result.isValid) {
      warnings.push(`Table error at line ${result.lineNumber}: ${result.error}`);
    }
  });
  
  // Calculate stats
  const headings = content.match(/^#{1,6}\s+.+$/gm) || [];
  const links = content.match(/\[([^\]]*)\]\(([^)]*)\)/g) || [];
  const images = content.match(/!\[([^\]]*)\]\(([^)]*)\)/g) || [];
  const words = content.split(/\s+/).filter(word => word.length > 0);
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    stats: {
      wordCount: words.length,
      headingCount: headings.length,
      linkCount: links.length,
      imageCount: images.length
    }
  };
}
