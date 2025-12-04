# Slides Content Specification

## Overview

This specification defines how educational content is authored in Markdown and transformed into JSON for the slide viewer frontend.

---

## Folder Structure

```
classes/
├── content/                          # 📁 ROOT level content (moved from apps/api/content)
│   ├── webdev/
│   │   ├── html_zero_to_one.md      # Source markdown
│   │   └── html_zero_to_one.json    # Generated JSON (by agent)
│   ├── devops/
│   │   └── docker_basics.md
│   └── dsa/
│       └── arrays_101.md
├── agents/
│   ├── specifications/               # This folder
│   └── prompts/
├── apps/
│   ├── api/                          # Serves JSON content via API
│   └── web/                          # Slide viewer frontend
```

---

## Markdown Format Specification

### File Naming

- Use `snake_case` for filenames
- Format: `{topic}_{subtopic}.md`
- Examples: `html_zero_to_one.md`, `css_flexbox_guide.md`

### Slide Separator

Use `---` (horizontal rule) to separate slides.

### Required Frontmatter

```yaml
---
title: "HTML Zero to One"
description: "Complete beginner's guide to HTML"
author: "leocodeio"
tags: ["html", "webdev", "beginner"]
created: "2024-01-15"
updated: "2024-12-04"
---
```

### Slide Structure Template

````markdown
---
title: "Course Title"
description: "Course description"
author: "author_name"
tags: ["tag1", "tag2"]
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
---

## 📚 Slide Title 1

Content for slide 1...

- Bullet points
- Key concepts

---

## 🎯 Slide Title 2

Content for slide 2...

### Subheading (stays on same slide)

```code
// Code blocks supported
```
````

---

## 💡 Slide Title 3

More content...

````

### Rules
1. Each `---` creates a NEW slide
2. First `## Heading` after `---` becomes slide title
3. `### Subheadings` stay within the same slide
4. Code blocks are preserved with syntax highlighting
5. Emojis in headings are encouraged for visual appeal

---

## JSON Output Specification

### Generated JSON Structure

```json
{
  "meta": {
    "title": "HTML Zero to One",
    "description": "Complete beginner's guide to HTML",
    "author": "leocodeio",
    "tags": ["html", "webdev", "beginner"],
    "created": "2024-01-15",
    "updated": "2024-12-04",
    "totalSlides": 8,
    "sourceFile": "html_zero_to_one.md"
  },
  "slides": [
    {
      "id": 1,
      "title": "What is HTML?",
      "content": "**HTML** stands for **Hyper Text Markup Language**\n\nThink of HTML as the **skeleton** of a website...",
      "contentHtml": "<p><strong>HTML</strong> stands for...</p>",
      "hasCode": false,
      "codeBlocks": []
    },
    {
      "id": 2,
      "title": "Why Learn HTML?",
      "content": "1. **Foundation of Web Development**...",
      "contentHtml": "<ol><li><strong>Foundation...</li></ol>",
      "hasCode": false,
      "codeBlocks": []
    },
    {
      "id": 3,
      "title": "Your First HTML Document",
      "content": "Let's create a simple HTML page!...",
      "contentHtml": "<p>Let's create...</p>",
      "hasCode": true,
      "codeBlocks": [
        {
          "language": "html",
          "code": "<!DOCTYPE html>\n<html>..."
        }
      ]
    }
  ]
}
````

### JSON Field Descriptions

| Field                  | Type    | Description                         |
| ---------------------- | ------- | ----------------------------------- |
| `meta.title`           | string  | Course/presentation title           |
| `meta.totalSlides`     | number  | Auto-calculated slide count         |
| `meta.sourceFile`      | string  | Original markdown filename          |
| `slides[].id`          | number  | Sequential slide number (1-indexed) |
| `slides[].title`       | string  | Extracted from first `## Heading`   |
| `slides[].content`     | string  | Raw markdown content                |
| `slides[].contentHtml` | string  | Pre-rendered HTML for performance   |
| `slides[].hasCode`     | boolean | Quick check for code highlighting   |
| `slides[].codeBlocks`  | array   | Extracted code blocks with language |

---

## Agent Workflow

### Step 1: Watch for Changes

```
content/**/*.md → trigger agent
```

### Step 2: Parse Markdown

```
1. Extract frontmatter (YAML)
2. Split content by `---` separator
3. Parse each section as a slide
4. Extract title from first ## heading
5. Identify code blocks
```

### Step 3: Generate JSON

```
1. Build meta object from frontmatter
2. Build slides array
3. Render markdown to HTML
4. Write to {filename}.json alongside .md
```

### Step 4: Validate

```
1. Ensure all slides have titles
2. Verify code block languages
3. Check for empty slides
4. Validate JSON structure
```

---

## Build Process Integration

### Automatic JSON Generation

JSON files are **automatically generated during the build process** using plain JavaScript:

```bash
# Full build (includes content processing)
pnpm build

# Just generate content files
pnpm build:content
```

### Build Script Implementation

**Location**: `scripts/build-content.js`

The build script:

1. Scans `content/` folder recursively for `.md` files
2. Parses YAML frontmatter from each file
3. Splits content by `---` separator into slides
4. Extracts slide titles from `## headings`
5. Renders markdown to HTML
6. Generates `.json` file in same directory as `.md`
7. Validates JSON structure
8. Reports results with summary

### npm Script Configuration

**Location**: `package.json`

```json
{
  "scripts": {
    "build:content": "node scripts/build-content.js",
    "build": "pnpm build:content && turbo run build"
  }
}
```

### Example Build Output

```bash
$ pnpm build:content

📖 Processing content files...
✅ content/webdev/html_zero_to_one.md → .json (8 slides)
✅ content/devops/docker_basics.md → .json (5 slides)
✅ content/dsa/arrays_101.md → .json (12 slides)

📊 Summary:
   - Files processed: 3
   - Total slides: 25
   - Errors: 0
   - Time: 234ms
```

---

## Frontend Usage

```typescript
// Fetch slide data
const response = await fetch("/api/content/webdev/html_zero_to_one");
const data: SlideData = await response.json();

// Navigate slides
const [currentSlide, setCurrentSlide] = useState(1);
const slide = data.slides[currentSlide - 1];
```

---

## Example Conversion

### Input: `html_zero_to_one.md`

```markdown
---
title: "HTML Zero to One"
description: "Complete beginner's guide"
author: "leocodeio"
tags: ["html"]
created: "2024-01-15"
updated: "2024-12-04"
---

## 🌟 What is HTML?

**HTML** stands for **Hyper Text Markup Language**

Think of HTML as the **skeleton** of a website.

---

## 💡 Why Learn HTML?

1. **Foundation of Web Development**
2. **Easy to Learn**
3. **Universal**
```

### Output: `html_zero_to_one.json`

```json
{
  "meta": {
    "title": "HTML Zero to One",
    "description": "Complete beginner's guide",
    "author": "leocodeio",
    "tags": ["html"],
    "created": "2024-01-15",
    "updated": "2024-12-04",
    "totalSlides": 2,
    "sourceFile": "html_zero_to_one.md"
  },
  "slides": [
    {
      "id": 1,
      "title": "What is HTML?",
      "content": "**HTML** stands for **Hyper Text Markup Language**\n\nThink of HTML as the **skeleton** of a website.",
      "contentHtml": "<p><strong>HTML</strong> stands for <strong>Hyper Text Markup Language</strong></p><p>Think of HTML as the <strong>skeleton</strong> of a website.</p>",
      "hasCode": false,
      "codeBlocks": []
    },
    {
      "id": 2,
      "title": "Why Learn HTML?",
      "content": "1. **Foundation of Web Development**\n2. **Easy to Learn**\n3. **Universal**",
      "contentHtml": "<ol><li><strong>Foundation of Web Development</strong></li><li><strong>Easy to Learn</strong></li><li><strong>Universal</strong></li></ol>",
      "hasCode": false,
      "codeBlocks": []
    }
  ]
}
```
