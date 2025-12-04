# Classes Project - Slides Content System

## 🎯 Project Overview

The goal is to build a **content-to-slides pipeline** that allows educators to write educational content once in Markdown, automatically convert it to JSON, and display it as an interactive slide viewer on the web.

### Why This Approach?

- **Single Source of Truth**: Content lives in version-controlled Markdown files
- **YouTube Ready**: Generate slides for educational video production
- **Maintainable**: Update content once, reflects everywhere
- **Scalable**: Add new courses without duplicating effort
- **Developer Friendly**: Integrates with existing monorepo structure

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CLASSES PROJECT                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   content/   │    │   agents/    │    │  apps/web/   │  │
│  │   (root)     │───▶│   scripts    │───▶│  (frontend)  │  │
│  │              │    │              │    │              │  │
│  │ *.md files   │    │ parse & gen  │    │ slide viewer │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│       Author              Agent              Renderer       │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              apps/api (endpoints)                    │   │
│  │  GET /api/content/:category/:topic (serve JSON)     │   │
│  └──────────────────────────────────────────────────────┘   │
│                         ▲                                   │
│                         │ fetch                             │
│                         ▼                                   │
│                    apps/web routes                         │
│                    /slides/:category/:topic                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### 1. **Content Authoring** (Author Phase)

**Where**: `content/{category}/{topic}.md`

**What the author does:**

```markdown
---
title: "HTML Zero to One"
description: "Complete beginner's guide to HTML"
author: "leocodeio"
tags: ["html", "webdev", "beginner"]
created: "2024-01-15"
updated: "2024-12-04"
---

## 📚 What is HTML?

Content here...

---

## 🎯 Next Topic

More content...
```

**Key points:**

- Write in Markdown with YAML frontmatter
- Use `---` to separate slides
- Each `## Heading` becomes a slide title
- Include code blocks with syntax highlighting
- Version controlled in GitHub

---

### 2. **Build Process Execution** (Automation Phase)

**Where**: `scripts/build-content.js` (plain JavaScript)

**What happens:**

```
Markdown Input
    ↓
[Parse YAML frontmatter using js-yaml]
    ↓
[Split by --- separator]
    ↓
[Extract slide titles from ## headings]
    ↓
[Identify code blocks]
    ↓
[Render Markdown to HTML using marked]
    ↓
[Apply syntax highlighting with highlight.js]
    ↓
[Generate JSON structure]
    ↓
[Write JSON alongside .md file]
```

**How it works:**

- Runs during `pnpm build:content` or as part of `pnpm build`
- Scans `content/` folder recursively for all `.md` files
- Generates `.json` file in same directory as each `.md`
- Validates structure and reports errors
- **No AI agents involved** - just plain JavaScript processing

**npm scripts in package.json:**

```json
{
  "scripts": {
    "build:content": "node scripts/build-content.js",
    "build": "pnpm build:content && turbo run build"
  }
}
```

**Build output example:**

```bash
$ pnpm build:content

📖 Processing content files...
✅ content/webdev/html_zero_to_one.md → .json (8 slides)
✅ content/devops/docker_basics.md → .json (5 slides)

📊 Summary:
   - Files processed: 2
   - Total slides: 13
   - Errors: 0
```

[Identify code blocks]
↓
[Render Markdown to HTML]
↓
[Generate JSON structure]
↓
JSON Output (alongside .md)

````

**Output structure:**

```json
{
  "meta": {
    "title": "HTML Zero to One",
    "totalSlides": 8,
    "author": "leocodeio",
    "tags": ["html", "webdev", "beginner"],
    "sourceFile": "html_zero_to_one.md"
  },
  "slides": [
    {
      "id": 1,
      "title": "What is HTML?",
      "content": "**HTML** stands for...",
      "contentHtml": "<p><strong>HTML</strong> stands for...</p>",
      "hasCode": false,
      "codeBlocks": []
    },
    {
      "id": 2,
      "title": "Next Topic",
      "content": "More content...",
      "contentHtml": "<p>More content...</p>",
      "hasCode": true,
      "codeBlocks": [...]
    }
  ]
}
````

**Trigger methods:**

- Manual: `pnpm agent:slides content/webdev/html_zero_to_one.md`
- Batch: `pnpm agent:slides:all`
- Watch: `pnpm agent:slides:watch` (auto-generate on save)

---

### 3. **API Serving** (Backend Phase)

**Where**: `apps/api/src/modules/content/`

**Endpoints:**

```
GET /api/content
  → List all available content

GET /api/content/:category
  → List all topics in a category

GET /api/content/:category/:topic
  → Get specific slide JSON data
```

**Example request:**

```bash
curl http://localhost:3000/api/content/webdev/html_zero_to_one
```

**Response:**

```json
{
  "meta": {...},
  "slides": [...]
}
```

---

### 4. **Frontend Rendering** (Display Phase)

**Where**: `apps/web/src/pages/Slides.tsx`

**Route**: `/slides/:category/:topic`

**Example**: `/slides/webdev/html-zero-to-one`

**Component Structure:**

```
SlideViewerPage
├── SlideHeader
│   ├── Title
│   ├── Progress bar (1/8)
│   └── Metadata
├── SlideContent
│   ├── Rendered HTML
│   ├── Code syntax highlighting
│   └── Responsive layout
└── SlideNavigation
    ├── Previous button (or ← key)
    ├── Next button (or → key)
    └── Keyboard hints
```

**Features:**

- Left/Right arrow navigation
- Keyboard support (← → keys)
- Full-screen mode
- Progress tracking
- Code syntax highlighting
- Minimalistic design with custom font

---

## 📂 Folder Structure

### Current State

```
classes/
├── content/                      # 📍 NEW: Root level content
│   ├── webdev/
│   │   ├── html_zero_to_one.md   # Source
│   │   └── html_zero_to_one.json # Generated
│   ├── devops/
│   │   ├── docker_basics.md
│   │   └── docker_basics.json
│   └── dsa/
│       └── ...
│
├── agents/
│   ├── specifications/           # 📍 NEW: System docs
│   │   ├── README.md
│   │   ├── slides-content-spec.md
│   │   ├── workflow-steps.md
│   │   └── markdown-template.md
│   └── prompts/
│       └── system-prompt.md
│
├── scripts/                        # 📍 NEW: Build scripts
│   └── build-content.js            # Parses MD → JSON (plain JS)
│
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── content/        # 📍 TODO: Content endpoints
│   │   │   │   └── auth/
│   │   │   └── main.ts
│   │   └── package.json
│   │
│   └── web/
│       ├── src/
│       │   ├── pages/
│       │   │   ├── Slides.tsx      # 📍 TODO: Slide viewer page
│       │   │   ├── Landing.tsx
│       │   │   └── ...
│       │   ├── components/
│       │   │   ├── SlideViewer/    # 📍 TODO: New slide components
│       │   │   ├── Layout.tsx
│       │   │   └── ...
│       │   └── App.tsx
│       └── package.json
│
├── pnpm-workspace.yaml
├── package.json
└── idea.md                         # 📍 THIS FILE
```

---

## ✅ Implementation Roadmap

### Phase 1: Foundation (✅ DONE)

- [x] Create specifications in `agents/specifications/`
- [x] Document markdown format
- [x] Document JSON schema
- [x] Document workflow steps
- [x] Commit to GitHub

### Phase 2: Build Scripts & Processing (📍 NEXT)

- [ ] Create `scripts/build-content.js` (plain JavaScript)
- [ ] Implement Markdown parser (using `marked`)
- [ ] Implement YAML frontmatter extraction (using `js-yaml`)
- [ ] Implement slide separator logic (split by `---`)
- [ ] Implement HTML rendering (marked + highlight.js)
- [ ] Implement code block syntax highlighting
- [ ] Add JSON file generation & validation
- [ ] Add error handling & reporting
- [ ] Create npm scripts (`build:content`) in root `package.json`

### Phase 3: API Endpoints

- [ ] Create content module in `apps/api/`
- [ ] Implement GET `/api/content`
- [ ] Implement GET `/api/content/:category`
- [ ] Implement GET `/api/content/:category/:topic`
- [ ] Add error handling & validation
- [ ] Serve `.json` files from `content/` folder

### Phase 4: Frontend Components

- [ ] Create `Slides.tsx` page component
- [ ] Create `SlideViewer` component
- [ ] Create `SlideHeader` component
- [ ] Create `SlideContent` component with HTML rendering
- [ ] Create `SlideNavigation` component
- [ ] Add keyboard navigation (← →)
- [ ] Add fullscreen mode
- [ ] Add code syntax highlighting
- [ ] Add progress tracking

### Phase 5: Content Migration

- [ ] Move existing `apps/api/content/` to root `content/`
- [ ] Update existing markdown files with frontmatter (title, description, author, etc)
- [ ] Run `pnpm build:content` to generate JSON files
- [ ] Test all content in slide viewer

- [ ] Generate JSON for all files
- [ ] Test all content in slide viewer

### Phase 6: YouTube Integration

- [ ] Export slides to PNG/PDF
- [ ] Add timing/notes for video production
- [ ] Create video workflow documentation

---

## 🛠️ Tech Stack

| Layer                 | Technology                   | Purpose                         |
| --------------------- | ---------------------------- | ------------------------------- |
| **Content**           | Markdown + YAML              | Easy authoring, version control |
| **Parsing**           | `remark` or `marked`         | Parse Markdown → AST            |
| **HTML Rendering**    | `remark-html` or `marked`    | Convert to HTML                 |
| **Code Highlighting** | `highlight.js` or `prism.js` | Syntax highlighting             |
| **File Watching**     | `chokidar`                   | Auto-generate on file change    |
| **Backend**           | NestJS (existing)            | Serve content via REST API      |
| **Frontend**          | React + TypeScript           | Interactive slide viewer        |
| **Styling**           | CSS/Tailwind (existing)      | Minimalistic design             |

---

## 🎨 Design Principles

1. **Minimalistic**: Clean, distraction-free slides
2. **Readable**: Large text, good contrast, custom font
3. **Keyboard-First**: Navigate with arrow keys
4. **Mobile-Friendly**: Responsive layout
5. **Code-Focused**: Syntax highlighting for technical content
6. **Dark Mode Support**: Theme aware

---

## 💾 File Organization Rules

### Markdown Files

- **Location**: `content/{category}/{topic}.md`
- **Naming**: `snake_case` for filenames
- **Structure**: YAML frontmatter + slide sections (separated by `---`)
- **Encoding**: UTF-8

### Generated JSON Files

- **Location**: Same as `.md` file
- **Naming**: Same as `.md` but `.json` extension
- **Auto-generated**: By agent scripts, NOT manually edited
- **Purpose**: Optimized for frontend consumption

### Categories

Suggested structure:

```
content/
├── webdev/        (HTML, CSS, JavaScript, React, etc.)
├── devops/        (Docker, Kubernetes, CI/CD, etc.)
├── dsa/           (Data Structures & Algorithms)
├── system-design/ (System Design & Architecture)
└── soft-skills/   (Communication, Leadership, etc.)
```

---

## 🚀 Future Enhancements

- [ ] **Interactivity**: Quiz slides, code playgrounds
- [ ] **Accessibility**: ARIA labels, keyboard navigation
- [ ] **Analytics**: Track which slides are viewed
- [ ] **Comments**: Community feedback on specific slides
- [ ] **Multilingual**: Support multiple languages
- [ ] **Collaborative Editing**: Google Docs-like collaboration
- [ ] **Live Coding**: Execute code in slide viewer
- [ ] **Slide Templates**: Pre-built slide layouts

---

## 📝 Notes

- All content is version-controlled in GitHub
- JSON files are generated automatically, never manually edited
- The system scales well: add new `.md` files, agent auto-generates JSON
- Frontend always fetches latest JSON from API
- Perfect for YouTube video creation workflow

---

## ❓ Questions & Decisions

**Q**: Should we cache JSON on the frontend or fetch fresh every time?
**A**: Fetch fresh on route change, cache in component state during navigation.

**Q**: What about slide animations/transitions?
**A**: Keep minimalistic - simple fade or no animations. Focus on content.

**Q**: Support for embedding videos/images?
**A**: Yes, via Markdown syntax: `![alt](url)` and embedding iframe in special syntax.

**Q**: Multi-language support from day 1?
**A**: No, add later. Focus on English content first.

**Q**: Should agents validate content?
**A**: Yes, warn about missing titles, empty slides, malformed frontmatter.
