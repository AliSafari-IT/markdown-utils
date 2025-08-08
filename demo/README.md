# @asafarim/markdown-utils Demo

This is an interactive demo application that showcases all the features and capabilities of the `@asafarim/markdown-utils` package.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Start the development server:**
   ```bash
   pnpm dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3001` to see the interactive demo.

## 📋 What's Included

### Content Analysis
- **Extract Headings**: Get all headings with levels and anchor links
- **Extract Paragraphs**: Get the first paragraph from markdown content
- **Extract Links**: Parse all markdown links with text and URLs
- **Extract Images**: Parse all markdown images with alt text, src, and titles
- **Strip Markdown**: Convert markdown to plain text
- **Word Count**: Count words in markdown content
- **Reading Time**: Estimate reading time based on word count

### Path & File Utilities
- **Filename Processing**: Convert filenames to slugs and titles
- **Path Operations**: Extract directory paths, normalize paths, get relative paths
- **Date Extraction**: Extract dates from file paths and names
- **File Type Detection**: Check if files are markdown files

### Date Utilities
- **Date Parsing**: Parse various date string formats
- **Date Formatting**: Format dates in different styles (ISO, readable, short, custom)
- **Date Validation**: Validate date objects and strings
- **Date Extraction**: Extract dates from markdown content

### Validation
- **Syntax Validation**: Check markdown syntax for common errors
- **Link Validation**: Validate markdown links and detect broken references
- **Image Validation**: Validate image references and alt text
- **Table Validation**: Check markdown table syntax

### Batch Processing
- **Multiple File Processing**: Process multiple markdown files at once
- **Directory Grouping**: Group files by their directory structure
- **Date Sorting**: Sort files by extracted dates
- **Summary Statistics**: Get aggregate statistics for multiple files

## 🎮 How to Use the Demo

### Interactive UI
1. **Enter Markdown Content**: Use the large textarea to input your markdown content
2. **Choose a Category**: Click on the tabs (Content Extraction, Analysis, Validation)
3. **Run Functions**: Click the buttons to execute different utility functions
4. **View Results**: See the formatted output in the results panel

### Path Processing
1. **Filename Demo**: Enter a filename to see slug generation, title extraction, and date parsing
2. **Path Demo**: Enter file paths to see directory extraction and path normalization

### Date Processing
1. **Date Input**: Enter dates in various formats or markdown content containing dates
2. **Parse and Format**: See how dates are parsed and formatted in different styles

### Console Demo
Open your browser's developer console to try the utilities directly:

```javascript
// Try these examples:
getWordCount("# Hello World\n\nThis is a test document with **bold** text.");
filenameToSlug("2023-12-01_My-Awesome-Article.md");
formatDate(new Date(), "readable");
getAllHeadings("# Title\n## Subtitle\n### Section");
```

## 🔧 Development

### Project Structure
```
demo/
├── src/
│   └── main.ts          # Main demo application logic
├── index.html           # Demo HTML interface
├── package.json         # Demo dependencies
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── README.md           # This file
```

### Building for Production
```bash
pnpm build
```

### Preview Production Build
```bash
pnpm preview
```

## 📚 Real-World Examples

### Blog Processing
```javascript
// Process a blog post
const blogPost = `
# My Awesome Blog Post

Published on 2023-12-01

This is an introduction to our new **markdown utilities** package.

## Features

- Fast and reliable
- Easy to use
- Well documented

Check out our [documentation](https://example.com/docs) for more details.
`;

// Analyze the content
console.log('Word count:', getWordCount(blogPost));
console.log('Reading time:', getReadingTime(blogPost), 'minutes');
console.log('Headings:', getAllHeadings(blogPost));
console.log('Links:', extractLinks(blogPost));
```

### File Organization
```javascript
// Organize markdown files
const files = [
  '/blog/2023-12-01_introduction.md',
  '/blog/2023-11-15_advanced-guide.md',
  '/docs/getting-started.md'
];

// Group by directory
console.log('Grouped:', groupPathsByDirectory(files));

// Sort by date
console.log('Sorted:', sortPathsByDate(files));

// Process filenames
files.forEach(file => {
  console.log({
    file,
    slug: filenameToSlug(file),
    title: filenameToTitle(file),
    date: extractDateFromPath(file)
  });
});
```

## 🎯 Use Cases

This demo demonstrates how the `@asafarim/markdown-utils` package can be used for:

- **Static Site Generators**: Process markdown files for blogs, documentation sites
- **Content Management Systems**: Analyze and validate markdown content
- **Documentation Tools**: Extract headings for table of contents, estimate reading times
- **Blog Platforms**: Generate slugs, extract metadata, validate content
- **File Processors**: Batch process markdown files, organize by dates
- **Content Analysis**: Get insights about markdown content (word count, links, images)

## 🔗 Links

- [Package Documentation](../README.md)
- [Source Code](../src/)
- [Tests](../tests/)
- [NPM Package](https://www.npmjs.com/package/@asafarim/markdown-utils)

## 🐛 Found an Issue?

If you find any issues with the demo or have suggestions for improvements, please open an issue in the main repository.
