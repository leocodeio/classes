# Markdown Template for Slides

Use this template as a starting point for new slide content.

---

## Empty Template

```markdown
---
title: "Your Course Title"
description: "Brief description of the course"
author: "your_username"
tags: ["tag1", "tag2", "tag3"]
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
---

## 📚 Introduction

Welcome content here...

---

## 🎯 Topic 1

Content for topic 1...

---

## 💡 Topic 2

Content for topic 2...

---

## 🚀 Topic 3

Content for topic 3...

---

## ✅ Summary

Key takeaways...
```

---

## Complete Example

````markdown
---
title: "CSS Flexbox Guide"
description: "Master CSS Flexbox layout in 10 slides"
author: "leocodeio"
tags: ["css", "flexbox", "layout", "webdev"]
created: "2024-12-04"
updated: "2024-12-04"
---

## 📚 What is Flexbox?

**Flexbox** (Flexible Box Layout) is a CSS layout module that makes it easy to design flexible and responsive layouts.

### Key Benefits:

- 📏 Automatic spacing and alignment
- 🔄 Easy direction changes (row/column)
- 📱 Responsive by default
- 🎯 No floats or positioning hacks

---

## 🎯 The Flex Container

To use Flexbox, you need a **flex container**:

```css
.container {
  display: flex;
}
```
````

All direct children become **flex items** automatically.

### Container Properties:

- `flex-direction`
- `justify-content`
- `align-items`
- `flex-wrap`

---

## 💡 flex-direction

Controls the main axis direction:

```css
.container {
  display: flex;
  flex-direction: row; /* default: left to right */
  flex-direction: row-reverse; /* right to left */
  flex-direction: column; /* top to bottom */
  flex-direction: column-reverse; /* bottom to top */
}
```

### Visual:

- `row` → ▶️▶️▶️
- `column` → 🔽🔽🔽

---

## 🚀 justify-content

Aligns items along the **main axis**:

```css
.container {
  display: flex;
  justify-content: flex-start; /* default */
  justify-content: flex-end;
  justify-content: center;
  justify-content: space-between;
  justify-content: space-around;
  justify-content: space-evenly;
}
```

---

## ✅ Summary

1. Use `display: flex` on the container
2. `flex-direction` sets the main axis
3. `justify-content` aligns along main axis
4. `align-items` aligns along cross axis
5. Flex items can grow, shrink, and have a base size

### Next Steps:

- Practice with [Flexbox Froggy](https://flexboxfroggy.com/)
- Build a responsive navbar using Flexbox

```

---

## Slide Content Guidelines

### DO ✅
- Use emojis in slide titles for visual appeal
- Keep each slide focused on ONE concept
- Include code examples with language specified
- Use bullet points for key takeaways
- Add subheadings (###) to organize within a slide

### DON'T ❌
- Don't put too much content on one slide
- Don't forget the frontmatter
- Don't use H1 (#) except in frontmatter title
- Don't add empty slides (double `---`)
- Don't mix unrelated topics on same slide

---

## Emoji Quick Reference

| Category | Emojis |
|----------|--------|
| Introduction | 📚 🎬 👋 🌟 |
| Concepts | 💡 🎯 🧠 📝 |
| Code/Technical | 💻 ⚙️ 🔧 📦 |
| Examples | 🚀 ✨ 🎨 🔍 |
| Warnings | ⚠️ 🚨 ❌ |
| Tips | 💡 ✅ 💪 🎉 |
| Summary | ✅ 📋 🏁 🎓 |

---

## Frontmatter Fields Reference

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `title` | ✅ Yes | string | Main title shown in UI |
| `description` | ✅ Yes | string | Brief description for SEO/preview |
| `author` | ✅ Yes | string | Author username |
| `tags` | ✅ Yes | array | Searchable tags |
| `created` | ✅ Yes | date | Creation date (YYYY-MM-DD) |
| `updated` | ✅ Yes | date | Last update date |
| `difficulty` | ❌ No | string | "beginner" / "intermediate" / "advanced" |
| `duration` | ❌ No | string | Estimated reading time |
| `prerequisites` | ❌ No | array | Required prior knowledge |
```
