# Package @asafarim/markdown-utils

[![npm version](https://badge.fury.io/js/@asafarim%2Fmarkdown-utils.svg)](https://badge.fury.io/js/@asafarim%2Fmarkdown-utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

A comprehensive collection of utility functions for markdown processing, metadata extraction, content parsing, and validation. Built with TypeScript for excellent developer experience and type safety.

## 🚀 Features

- **📅 Date Utilities** - Extract creation/update dates from markdown content
- **📝 Content Parsing** - Extract headings, paragraphs, links, images, and code blocks
- **🔧 Path Utilities** - Handle file paths, slugs, and directory operations
- **✅ Validation** - Validate markdown syntax, links, images, and tables
- **🎯 TypeScript Support** - Full type definitions included
- **🌳 Tree Shakable** - Import only what you need
- **📦 Multiple Formats** - ESM and CommonJS support

-----
• 👉 View live demo at: [@asafarim/markdown-utils Demo](https://alisafari-it.github.io/markdown-utils/)
-----


## 📦 Installation

```bash
npm install @asafarim/markdown-utils
```

```bash
yarn add @asafarim/markdown-utils
```

```bash
pnpm add @asafarim/markdown-utils
```

## 🏁 Quick Start

### Named Imports (Recommended)

```typescript
import { 
  getFirstHeading, 
  getCreationDate, 
  stripMarkdown,
  validateMarkdown 
} from '@asafarim/markdown-utils';

const content = `
# My Document
Created: 2024-12-07

**Bold text** and *italic text*.
`;

// Extract heading
const title = getFirstHeading(content); // "My Document"

// Extract date
const created = getCreationDate(content); // Date object

// Get plain text
const plainText = stripMarkdown(content); // Clean text without markdown

// Validate content
const validation = validateMarkdown(content);
console.log(validation.isValid); // true
```

### Default Import

```typescript
import markdownUtils from '@asafarim/markdown-utils';

// Use grouped utilities
const title = markdownUtils.content.getFirstHeading(content);
const created = markdownUtils.date.getCreationDate(content);
const isValid = markdownUtils.validation.isValidMarkdown(content);
```

## 📚 API Reference

### Date Utilities

Extract and work with dates from markdown content:

```typescript
import { 
  getCreationDate, 
  getUpdateDate, 
  formatDate, 
  getTimeAgo 
} from '@asafarim/markdown-utils';

// Extract dates from various patterns
const created = getCreationDate('Date: 2024-12-07');
const updated = getUpdateDate('Updated: December 8, 2024');

// Format dates
const formatted = formatDate(new Date()); // "Dec 7, 2024"
const timeAgo = getTimeAgo(new Date(Date.now() - 86400000)); // "1 day ago"
```

### Content Parsing

Parse and extract content from markdown:

```typescript
import { 
  getFirstHeading,
  getAllHeadings,
  extractLinks,
  extractImages,
  getWordCount,
  getReadingTime
} from '@asafarim/markdown-utils';

const content = `
# Main Title
## Subtitle

Check out [my website](https://example.com) and this ![image](photo.jpg).
`;

const title = getFirstHeading(content); // "Main Title"
const headings = getAllHeadings(content); // Array of heading objects
const links = extractLinks(content); // Array of link objects
const images = extractImages(content); // Array of image objects
const wordCount = getWordCount(content); // Number of words
const readingTime = getReadingTime(content); // Estimated minutes
```

### Path Utilities

Handle file paths and create slugs:

```typescript
import { 
  getFileNameWithoutExtension,
  filenameToSlug,
  filenameToTitle,
  extractDateFromPath
} from '@asafarim/markdown-utils';

const filename = getFileNameWithoutExtension('/docs/my-file.md'); // "my-file"
const slug = filenameToSlug('My Great Article!'); // "my-great-article"
const title = filenameToTitle('my-great-article'); // "My Great Article"
const date = extractDateFromPath('2024-12-07-article.md'); // Date object
```

### Validation

Validate markdown content and syntax:

```typescript
import { 
  validateMarkdown,
  validateMarkdownLinks,
  isValidMarkdown
} from '@asafarim/markdown-utils';

const content = `# Title\n[Link](https://example.com)`;

const validation = validateMarkdown(content);
console.log(validation.isValid); // true
console.log(validation.stats); // { wordCount: 2, headingCount: 1, ... }

const linkValidation = validateMarkdownLinks(content);
console.log(linkValidation[0].isValid); // true
```

## 🎯 Use Cases

### Blog/Documentation Systems

```typescript
import { getFirstHeading, getCreationDate, getReadingTime } from '@asafarim/markdown-utils';

function processMarkdownPost(content: string) {
  return {
    title: getFirstHeading(content),
    publishedAt: getCreationDate(content),
    readingTime: getReadingTime(content),
    wordCount: getWordCount(content)
  };
}
```

### Static Site Generators

```typescript
import { extractDateFromPath, filenameToSlug } from '@asafarim/markdown-utils';

function processMarkdownFiles(filePaths: string[]) {
  return filePaths.map(path => ({
    slug: filenameToSlug(path),
    date: extractDateFromPath(path),
    path
  }));
}
```

### Content Validation

```typescript
import { validateMarkdown } from '@asafarim/markdown-utils';

function validateContent(content: string) {
  const result = validateMarkdown(content);
  
  if (!result.isValid) {
    console.error('Validation errors:', result.errors);
  }
  
  if (result.warnings.length > 0) {
    console.warn('Warnings:', result.warnings);
  }
  
  return result;
}
```

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/AliSafari-IT/asafarim.git
cd asafarim/ASafariM.Clients/packages/markdown-utils

# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Build the package
pnpm build

# Run linting
pnpm lint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [TypeScript](https://www.typescriptlang.org/)
- Bundled with [tsup](https://tsup.egoist.dev/)
- Tested with [Vitest](https://vitest.dev/)

## 📞 Support

- 📧 Email: asafarim@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/AliSafari-IT/asafarim/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/AliSafari-IT/asafarim/discussions)

---

Made with ❤️ by [Ali Safari](https://github.com/AliSafari-IT)
