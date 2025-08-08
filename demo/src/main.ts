// Import all utilities from the markdown-utils package
import {
  // Content utilities
  getFirstHeading,
  getAllHeadings,
  getFirstParagraph,
  extractLinks,
  extractImages,
  stripMarkdown,
  getWordCount,
  getReadingTime,
  extractCodeBlocks,
  
  // Path utilities
  filenameToSlug,
  filenameToTitle,
  extractDateFromPath,
  isMarkdownFile,
  normalizePath,
  getRelativePath,
  getFileNameWithoutExtension,
  getDirectoryPath,
  groupPathsByDirectory,
  sortPathsByDate,
  
  // Date utilities
  getCreationDate,
  getUpdateDate,
  formatDate,
  getTimeAgo,
  
  // Validation utilities
  validateMarkdown,
  validateMarkdownLinks,  validateMarkdownImages
} from '../..';

// Global functions for HTML demo
declare global {
  interface Window {
    extractHeadings: () => void;
    extractParagraph: () => void;
    extractLinks: () => void;
    extractImages: () => void;
    stripMarkdown: () => void;
    parseToHtml: () => void;
    analyzeWordCount: () => void;
    analyzeReadingTime: () => void;
    analyzeAll: () => void;
    validateSyntax: () => void;
    validateLinks: () => void;
    validateImages: () => void;
    processFilename: () => void;
    processPath: () => void;
    parseDates: () => void;
    formatDates: () => void;
    batchProcessDemo: () => void;
    clearBatchResults: () => void;
  }
}

// Utility function to get markdown input
function getMarkdownInput(): string {
  const textarea = document.getElementById('markdown-input') as HTMLTextAreaElement;
  return textarea?.value || '';
}

// Simple markdown to HTML converter (basic implementation)
function markdownToHtml(markdown: string): string {
  return markdown
    // Headers
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // Bold and italic
    .replace(/\*\*([^*]*)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]*)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]*)\]\(([^)]*)\)/g, '<a href="$2">$1</a>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]*)\)/g, '<img src="$2" alt="$1" />')
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    // Inline code
    .replace(/`([^`]*)`/g, '<code>$1</code>')
    // Lists
    .replace(/^\* (.*$)/gm, '<li>$1</li>')
    .replace(/^\- (.*$)/gm, '<li>$1</li>')
    .replace(/^\+ (.*$)/gm, '<li>$1</li>')
    // Wrap consecutive list items in ul
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    // Wrap in paragraphs
    .replace(/^(?!<[hup])/gm, '<p>')
    .replace(/(?<!>)$/gm, '</p>')
    // Clean up extra tags
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<[hup])/g, '$1')
    .replace(/(<\/[hup]>)<\/p>/g, '$1');
}
function displayResults(elementId: string, content: string, type: 'json' | 'text' | 'number' | 'html' = 'json') {
  const element = document.getElementById(elementId);
  if (element) {
    if (type === 'html') {
      element.innerHTML = content;
      element.className = `results ${type}`;
    } else {
      element.textContent = content;
      element.className = `results ${type}`;
    }
  }
}

// Content extraction functions
window.extractHeadings = () => {
  const markdown = getMarkdownInput();
  const headings = getAllHeadings(markdown);
  const firstHeading = getFirstHeading(markdown);
  
  const result = {
    firstHeading,
    allHeadings: headings,
    count: headings.length
  };
  
  displayResults('content-results', JSON.stringify(result, null, 2));
};

window.extractParagraph = () => {
  const markdown = getMarkdownInput();
  const paragraph = getFirstParagraph(markdown);
  
  displayResults('content-results', paragraph, 'text');
};

window.extractLinks = () => {
  const markdown = getMarkdownInput();
  const links = extractLinks(markdown);
  
  displayResults('content-results', JSON.stringify(links, null, 2));
};

window.extractImages = () => {
  const markdown = getMarkdownInput();
  const images = extractImages(markdown);
  
  displayResults('content-results', JSON.stringify(images, null, 2));
};

window.stripMarkdown = () => {
  const markdown = getMarkdownInput();
  const plainText = stripMarkdown(markdown);
  
  displayResults('content-results', plainText, 'text');
};

window.parseToHtml = () => {
  const markdown = getMarkdownInput();
  const html = markdownToHtml(markdown);
  
  // Show both the HTML code and rendered HTML
  const result = `<div style="margin-bottom: 20px;">
    <h4>HTML Output:</h4>
    <div style="border: 1px solid #ddd; padding: 10px; background: white; border-radius: 4px;">
      ${html}
    </div>
    <h4 style="margin-top: 15px;">HTML Source:</h4>
    <pre style="background: #f8f9fa; padding: 10px; border-radius: 4px; overflow-x: auto;"><code>${html.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
  </div>`;
  
  displayResults('content-results', result, 'html');
};

// Analysis functions
window.analyzeWordCount = () => {
  const markdown = getMarkdownInput();
  const wordCount = getWordCount(markdown);
  
  displayResults('analysis-results', `Word Count: ${wordCount}`, 'number');
};

window.analyzeReadingTime = () => {
  const markdown = getMarkdownInput();
  const readingTime = getReadingTime(markdown);
  const customReadingTime = getReadingTime(markdown, 150); // 150 WPM
  
  const result = {
    standardReadingTime: `${readingTime} minute(s)`,
    customReadingTime150WPM: `${customReadingTime} minute(s)`,
    wordCount: getWordCount(markdown)
  };
  
  displayResults('analysis-results', JSON.stringify(result, null, 2));
};

window.analyzeAll = () => {
  const markdown = getMarkdownInput();
  
  const analysis = {
    wordCount: getWordCount(markdown),
    readingTime: getReadingTime(markdown),
    headingCount: getAllHeadings(markdown).length,
    linkCount: extractLinks(markdown).length,
    imageCount: extractImages(markdown).length,
    codeBlockCount: extractCodeBlocks(markdown).length,
    firstHeading: getFirstHeading(markdown),
    firstParagraph: getFirstParagraph(markdown).substring(0, 100) + '...'
  };
  
  displayResults('analysis-results', JSON.stringify(analysis, null, 2));
};

// Validation functions
window.validateSyntax = () => {
  const markdown = getMarkdownInput();
  const validation = validateMarkdown(markdown);
  
  displayResults('validation-results', JSON.stringify(validation, null, 2));
};

window.validateLinks = () => {
  const markdown = getMarkdownInput();
  const validation = validateMarkdownLinks(markdown);
  
  displayResults('validation-results', JSON.stringify(validation, null, 2));
};

window.validateImages = () => {
  const markdown = getMarkdownInput();
  const validation = validateMarkdownImages(markdown);
  
  displayResults('validation-results', JSON.stringify(validation, null, 2));
};

// Path processing functions
window.processFilename = () => {
  const filenameInput = document.getElementById('filename-input') as HTMLInputElement;
  const filename = filenameInput?.value || '';
  
  const result = {
    original: filename,
    slug: filenameToSlug(filename),
    title: filenameToTitle(filename),
    withoutExtension: getFileNameWithoutExtension(filename),
    isMarkdown: isMarkdownFile(filename),
    extractedDate: extractDateFromPath(filename)?.toISOString() || null
  };
  
  displayResults('filename-results', JSON.stringify(result, null, 2));
};

window.processPath = () => {
  const filepathInput = document.getElementById('filepath-input') as HTMLInputElement;
  const basepathInput = document.getElementById('basepath-input') as HTMLInputElement;
  const filepath = filepathInput?.value || '';
  const basepath = basepathInput?.value || '';
  
  const result = {
    original: filepath,
    normalized: normalizePath(filepath),
    directory: getDirectoryPath(filepath),
    filename: getFileNameWithoutExtension(filepath),
    relativePath: getRelativePath(filepath, basepath),
    isMarkdown: isMarkdownFile(filepath),
    extractedDate: extractDateFromPath(filepath)?.toISOString() || null
  };
  
  displayResults('path-results', JSON.stringify(result, null, 2));
};

// Date processing functions
window.parseDates = () => {
  const dateInput = document.getElementById('date-input') as HTMLInputElement;
  const input = dateInput?.value || '';
  
  // Try to parse as date string first
  let parsedDate: Date | null = null;
  try {
    const date = new Date(input);
    if (!isNaN(date.getTime())) {
      parsedDate = date;
    }
  } catch (e) {
    // Invalid date
  }
  
  // Try to extract date from content using our utilities
  const extractedFromContent = getCreationDate(input) || getUpdateDate(input);
  
  const result = {
    input,
    parsedDate: parsedDate?.toISOString() || null,
    extractedFromContent: extractedFromContent?.toISOString() || null,
    isValidDate: !!(parsedDate || extractedFromContent)
  };
  
  displayResults('date-results', JSON.stringify(result, null, 2));
};

window.formatDates = () => {
  const dateInput = document.getElementById('date-input') as HTMLInputElement;
  const input = dateInput?.value || '';
  
  let date: Date;
  try {
    date = new Date(input);
    if (isNaN(date.getTime())) {
      date = new Date();
    }
  } catch (e) {
    date = new Date();
  }
  
  const result = {
    iso: date.toISOString(),
    readable: date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    short: date.toLocaleDateString('en-US'),
    timeAgo: getTimeAgo(date),
    formatted: formatDate(date)
  };
  
  displayResults('date-results', JSON.stringify(result, null, 2));
};

// Batch processing demo
window.batchProcessDemo = () => {
  const sampleFiles = [
    '/blog/2023-12-01_introduction-to-markdown.md',
    '/blog/2023-11-15_advanced-techniques.md', 
    '/docs/getting-started.md',
    '/docs/api-reference.md',
    '/tutorials/2023-10-20_beginner-guide.md'
  ];
  
  const sampleContent = `# Sample Article

This is a **sample article** with various markdown elements.

## Introduction

Welcome to our [comprehensive guide](https://example.com/guide) on markdown processing.

![Sample Image](https://via.placeholder.com/400x200 "Sample")

### Features

- Word counting
- Reading time estimation  
- Link extraction
- Image processing

\`\`\`javascript
console.log("Hello, Markdown!");
\`\`\`

This article contains multiple paragraphs and should demonstrate the various utilities available in the markdown-utils package.`;

  // Process each file
  const results = sampleFiles.map(filepath => {
    const filename = getFileNameWithoutExtension(filepath);
    const directory = getDirectoryPath(filepath);
    
    return {
      filepath,
      filename,
      directory,
      slug: filenameToSlug(filepath),
      title: filenameToTitle(filepath),
      date: extractDateFromPath(filepath)?.toISOString() || null,
      isMarkdown: isMarkdownFile(filepath),
      // Sample content analysis
      analysis: {
        wordCount: getWordCount(sampleContent),
        readingTime: getReadingTime(sampleContent),
        headings: getAllHeadings(sampleContent).length,
        links: extractLinks(sampleContent).length,
        images: extractImages(sampleContent).length
      }
    };
  });
  
  // Group by directory
  const groupedPaths = groupPathsByDirectory(sampleFiles);
  
  // Sort by date
  const sortedPaths = sortPathsByDate(sampleFiles);
  
  const batchResult = {
    totalFiles: sampleFiles.length,
    processedFiles: results,
    groupedByDirectory: groupedPaths,
    sortedByDate: sortedPaths,
    summary: {
      totalWordCount: results.reduce((sum, r) => sum + r.analysis.wordCount, 0),
      averageReadingTime: Math.round(results.reduce((sum, r) => sum + r.analysis.readingTime, 0) / results.length),
      totalHeadings: results.reduce((sum, r) => sum + r.analysis.headings, 0),
      totalLinks: results.reduce((sum, r) => sum + r.analysis.links, 0),
      totalImages: results.reduce((sum, r) => sum + r.analysis.images, 0)
    }
  };
  
  displayResults('batch-results', JSON.stringify(batchResult, null, 2));
};

window.clearBatchResults = () => {
  displayResults('batch-results', '');
};

// Tab functionality
document.addEventListener('DOMContentLoaded', () => {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.getAttribute('data-tab');
      
      // Remove active class from all buttons and contents
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked button and corresponding content
      button.classList.add('active');
      const targetContent = document.getElementById(`${tabName}-tab`);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
});

// Console demo for developers
console.log('🚀 @asafarim/markdown-utils Demo loaded!');
console.log('Available utilities:', {
  contentUtils: ['getFirstHeading', 'getAllHeadings', 'getFirstParagraph', 'extractLinks', 'extractImages', 'stripMarkdown', 'getWordCount', 'getReadingTime'],
  pathUtils: ['filenameToSlug', 'filenameToTitle', 'extractDateFromPath', 'isMarkdownFile', 'normalizePath'],
  dateUtils: ['getCreationDate', 'getUpdateDate', 'formatDate', 'getTimeAgo'],
  validationUtils: ['validateMarkdown', 'validateMarkdownLinks', 'validateMarkdownImages']
});

// Example usage in console
console.log('Try this in the console:');
console.log('getWordCount("# Hello World\\n\\nThis is a test document with **bold** text.")');
console.log('filenameToSlug("2023-12-01_My-Awesome-Article.md")');
console.log('formatDate(new Date())');
