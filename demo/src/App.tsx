import React, { useMemo, useState } from 'react';
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
  validateMarkdownLinks,
  validateMarkdownImages,
} from '@asafarim/markdown-utils';
import { PackageLinks } from '@asafarim/shared';

const initialMarkdown = `# Welcome to Our Blog

This is a **comprehensive guide** to using *markdown utilities* in your projects.

## Features

- Extract headings and paragraphs
- Count words and estimate reading time
- Parse links and images
- Validate markdown syntax

Check out our [documentation](https://example.com/docs) for more details.

![Sample Image](https://via.placeholder.com/300x200 "Sample Image Title")

### Code Example

\`\`\`javascript
const utils = require('@asafarim/markdown-utils');
console.log('Hello World!');
\`\`\`

This content contains approximately 50 words and should take about 1 minute to read.`;

type Tab = 'content' | 'analysis' | 'validation';

function markdownToHtml(markdown: string): string {
  return markdown
    .replace(/^### (.*$)/gm, '<h3>$1<\/h3>')
    .replace(/^## (.*$)/gm, '<h2>$1<\/h2>')
    .replace(/^# (.*$)/gm, '<h1>$1<\/h1>')
    .replace(/\*\*([^*]*)\*\*/g, '<strong>$1<\/strong>')
    .replace(/\*([^*]*)\*/g, '<em>$1<\/em>')
    .replace(/\[([^\]]*)\]\(([^)]*)\)/g, '<a href="$2">$1<\/a>')
    .replace(/!\[([^\]]*)\]\(([^)]*)\)/g, '<img src="$2" alt="$1" \/>')
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2<\/code><\/pre>')
    .replace(/`([^`]*)`/g, '<code>$1<\/code>')
    .replace(/^\* (.*$)/gm, '<li>$1<\/li>')
    .replace(/^\- (.*$)/gm, '<li>$1<\/li>')
    .replace(/^\+ (.*$)/gm, '<li>$1<\/li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1<\/ul>')
    .replace(/\n\n/g, '<\/p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^(?!<[hup])/gm, '<p>')
    .replace(/(?<!>)$/gm, '<\/p>')
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<[hup])/g, '$1')
    .replace(/(<\/[hup]>)<\/p>/g, '$1');
}

const usageSnippet = `import {
  getWordCount,
  getReadingTime,
  getAllHeadings,
  extractLinks,
  filenameToSlug,
} from '@asafarim/markdown-utils';

const markdownContent = '# My Article\n\nThis is some **bold** text with a [link](https://example.com).';

// Analyze content
console.log('Word count:', getWordCount(markdownContent));
console.log('Reading time:', getReadingTime(markdownContent), 'minutes');
console.log('Headings:', getAllHeadings(markdownContent));
console.log('Links:', extractLinks(markdownContent));

// Process filenames
const slug = filenameToSlug('2023-12-01_My-Article.md');
console.log('Generated slug:', slug); // "2023-12-01-my-article"`;

const App: React.FC = () => {
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [activeTab, setActiveTab] = useState<Tab>('content');

  const contentResults = useMemo(() => {
    const headings = getAllHeadings(markdown);
    const firstHeading = getFirstHeading(markdown);
    return JSON.stringify({ firstHeading, allHeadings: headings, count: headings.length }, null, 2);
  }, [markdown]);

  const htmlPreview = useMemo(() => markdownToHtml(markdown), [markdown]);

  const analysisResults = useMemo(() => {
    const result = {
      wordCount: getWordCount(markdown),
      readingTime: getReadingTime(markdown),
      headingCount: getAllHeadings(markdown).length,
      linkCount: extractLinks(markdown).length,
      imageCount: extractImages(markdown).length,
      codeBlockCount: extractCodeBlocks(markdown).length,
      firstHeading: getFirstHeading(markdown),
      firstParagraph: getFirstParagraph(markdown).substring(0, 100) + '...',
    };
    return JSON.stringify(result, null, 2);
  }, [markdown]);

  const validationResults = useMemo(() => {
    const syntax = validateMarkdown(markdown);
    const links = validateMarkdownLinks(markdown);
    const images = validateMarkdownImages(markdown);
    return JSON.stringify({ syntax, links, images }, null, 2);
  }, [markdown]);

  const [filename, setFilename] = useState('2023-12-01_my-awesome-blog-post.md');
  const [filepath, setFilepath] = useState('/content/blog/2023/my-article.md');
  const [basepath, setBasepath] = useState('/content');
  const [dateInput, setDateInput] = useState('2023-12-01');

  const filenameInfo = useMemo(() => ({
    original: filename,
    slug: filenameToSlug(filename),
    title: filenameToTitle(filename),
    withoutExtension: getFileNameWithoutExtension(filename),
    isMarkdown: isMarkdownFile(filename),
    extractedDate: extractDateFromPath(filename)?.toISOString() || null,
  }), [filename]);

  const pathInfo = useMemo(() => ({
    original: filepath,
    normalized: normalizePath(filepath),
    directory: getDirectoryPath(filepath),
    filename: getFileNameWithoutExtension(filepath),
    relativePath: getRelativePath(filepath, basepath),
    isMarkdown: isMarkdownFile(filepath),
    extractedDate: extractDateFromPath(filepath)?.toISOString() || null,
  }), [filepath, basepath]);

  const dateParseInfo = useMemo(() => {
    let parsedDate: Date | null = null;
    try {
      const d = new Date(dateInput);
      if (!isNaN(d.getTime())) parsedDate = d;
    } catch {}
    const extractedFromContent = getCreationDate(dateInput) || getUpdateDate(dateInput);
    return {
      input: dateInput,
      parsedDate: parsedDate?.toISOString() || null,
      extractedFromContent: extractedFromContent?.toISOString() || null,
      isValidDate: !!(parsedDate || extractedFromContent),
    };
  }, [dateInput]);

  const dateFormatInfo = useMemo(() => {
    let d: Date;
    try {
      d = new Date(dateInput);
      if (isNaN(d.getTime())) d = new Date();
    } catch {
      d = new Date();
    }
    return {
      iso: d.toISOString(),
      readable: d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      short: d.toLocaleDateString('en-US'),
      timeAgo: getTimeAgo(d),
      formatted: formatDate(d),
    };
  }, [dateInput]);

  const batchResults = useMemo(() => {
    const sampleFiles = [
      '/blog/2023-12-01_introduction-to-markdown.md',
      '/blog/2023-11-15_advanced-techniques.md',
      '/docs/getting-started.md',
      '/docs/api-reference.md',
      '/tutorials/2023-10-20_beginner-guide.md',
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

    const results = sampleFiles.map((p) => {
      const filenameOnly = getFileNameWithoutExtension(p);
      const directory = getDirectoryPath(p);
      return {
        filepath: p,
        filename: filenameOnly,
        directory,
        slug: filenameToSlug(p),
        title: filenameToTitle(p),
        date: extractDateFromPath(p)?.toISOString() || null,
        isMarkdown: isMarkdownFile(p),
        analysis: {
          wordCount: getWordCount(sampleContent),
          readingTime: getReadingTime(sampleContent),
          headings: getAllHeadings(sampleContent).length,
          links: extractLinks(sampleContent).length,
          images: extractImages(sampleContent).length,
        },
      };
    });

    const groupedPaths = groupPathsByDirectory(sampleFiles);
    const sortedPaths = sortPathsByDate(sampleFiles);

    return {
      totalFiles: sampleFiles.length,
      processedFiles: results,
      groupedByDirectory: groupedPaths,
      sortedByDate: sortedPaths,
      summary: {
        totalWordCount: results.reduce((s, r) => s + r.analysis.wordCount, 0),
        averageReadingTime: Math.round(results.reduce((s, r) => s + r.analysis.readingTime, 0) / results.length),
        totalHeadings: results.reduce((s, r) => s + r.analysis.headings, 0),
        totalLinks: results.reduce((s, r) => s + r.analysis.links, 0),
        totalImages: results.reduce((s, r) => s + r.analysis.images, 0),
      },
    };
  }, []);

  return (
    <div className="container">
      <header>
        <h1>@asafarim/markdown-utils</h1>
        <p className="subtitle">Interactive Demo - Explore Markdown Processing Utilities</p>
      </header>
      <PackageLinks packageName="@asafarim/markdown-utils" githubPath="markdown-utils" demoPath='https://alisafari-it.github.io/markdown-utils/' />

      <div className="demo-section">
        <h2>📝 Content Analysis</h2>
        <div className="input-group">
          <label htmlFor="markdown-input">Markdown Content:</label>
          <textarea id="markdown-input" value={markdown} onChange={(e) => setMarkdown(e.target.value)} />
        </div>

        <div className="tab-container">
          <div className="tab-buttons">
            {(['content', 'analysis', 'validation'] as Tab[]).map((tab) => (
              <button
                key={tab}
                className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'content' ? 'Content Extraction' : tab === 'analysis' ? 'Analysis' : 'Validation'}
              </button>
            ))}
          </div>

          {activeTab === 'content' && (
            <div className="tab-content active" id="content-tab">
              <div className="button-group">
                <button onClick={() => setMarkdown(stripMarkdown(markdown))}>Strip Markdown</button>
              </div>
              <div id="content-results" className="results json">
                {contentResults}
              </div>
              <div className="results html" style={{ marginTop: '12px' }}>
                <h3>Rendered HTML</h3>
                <div dangerouslySetInnerHTML={{ __html: htmlPreview }} />
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="tab-content active" id="analysis-tab">
              <div id="analysis-results" className="results json">{analysisResults}</div>
            </div>
          )}

          {activeTab === 'validation' && (
            <div className="tab-content active" id="validation-tab">
              <div id="validation-results" className="results json">{validationResults}</div>
            </div>
          )}
        </div>
      </div>

      <div className="demo-section">
        <h2>📁 Path & File Utilities</h2>
        <div className="grid">
          <div className="card">
            <h4>Filename Processing</h4>
            <div className="input-group">
              <label htmlFor="filename-input">Filename:</label>
              <input id="filename-input" type="text" value={filename} onChange={(e) => setFilename(e.target.value)} />
            </div>
            <div id="filename-results" className="results json">{JSON.stringify(filenameInfo, null, 2)}</div>
          </div>

          <div className="card">
            <h4>Path Operations</h4>
            <div className="input-group">
              <label htmlFor="filepath-input">File Path:</label>
              <input id="filepath-input" type="text" value={filepath} onChange={(e) => setFilepath(e.target.value)} />
            </div>
            <div className="input-group">
              <label htmlFor="basepath-input">Base Path:</label>
              <input id="basepath-input" type="text" value={basepath} onChange={(e) => setBasepath(e.target.value)} />
            </div>
            <div id="path-results" className="results json">{JSON.stringify(pathInfo, null, 2)}</div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>📅 Date Utilities</h2>
        <div className="input-group">
          <label htmlFor="date-input">Date String or Markdown Content:</label>
          <input id="date-input" type="text" value={dateInput} onChange={(e) => setDateInput(e.target.value)} />
        </div>
        <div id="date-results" className="results json">{JSON.stringify(dateParseInfo, null, 2)}</div>
        <div className="results json" style={{ marginTop: '12px' }}>{JSON.stringify(dateFormatInfo, null, 2)}</div>
      </div>

      <div className="demo-section">
        <h2>🔧 Batch Processing Example</h2>
        <div id="batch-results" className="results json">{JSON.stringify(batchResults, null, 2)}</div>
      </div>

      <div className="demo-section">
        <h2>💡 Code Example</h2>
        <p>Here's how to use the utilities in your project:</p>
        <div className="results html">
          <pre>
            <code>
              {usageSnippet}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default App;


