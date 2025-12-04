#!/usr/bin/env node

/**
 * Build Content Script
 *
 * Converts Markdown files with YAML frontmatter into JSON format for the slide viewer.
 *
 * Usage:
 *   node scripts/build-content.js           # Process all .md files in content/
 *   node scripts/build-content.js <file>    # Process a specific file
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { marked } = require("marked");
const hljs = require("highlight.js");
const { glob } = require("glob");

// Configure marked with highlight.js for syntax highlighting
marked.setOptions({
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (err) {
        console.warn(
          `Warning: Failed to highlight code block with language "${lang}"`,
        );
      }
    }
    return hljs.highlightAuto(code).value;
  },
  gfm: true,
  breaks: false,
});

// Stats for summary
const stats = {
  filesProcessed: 0,
  totalSlides: 0,
  errors: [],
  startTime: Date.now(),
};

/**
 * Extract YAML frontmatter from markdown content
 * @param {string} content - Raw markdown content
 * @returns {{ frontmatter: object, body: string }}
 */
function extractFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    throw new Error(
      "Missing YAML frontmatter. File must start with --- and contain frontmatter.",
    );
  }

  const frontmatter = yaml.load(match[1]);
  const body = content.slice(match[0].length);

  // Validate required frontmatter fields
  const requiredFields = ["title", "description", "author"];
  const missingFields = requiredFields.filter((field) => !frontmatter[field]);

  if (missingFields.length > 0) {
    throw new Error(
      `Missing required frontmatter fields: ${missingFields.join(", ")}`,
    );
  }

  return { frontmatter, body };
}

/**
 * Split content into slides by --- separator
 * @param {string} body - Markdown body (without frontmatter)
 * @returns {string[]}
 */
function splitIntoSlides(body) {
  // Split by horizontal rule (---) that's on its own line
  // Be careful not to split on --- inside code blocks
  const slides = [];
  let currentSlide = "";
  let inCodeBlock = false;

  const lines = body.split("\n");

  for (const line of lines) {
    // Check if we're entering or exiting a code block
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
    }

    // Check for slide separator (--- on its own line, not in code block)
    if (!inCodeBlock && /^---\s*$/.test(line.trim())) {
      if (currentSlide.trim()) {
        slides.push(currentSlide.trim());
      }
      currentSlide = "";
    } else {
      currentSlide += line + "\n";
    }
  }

  // Add the last slide if it has content
  if (currentSlide.trim()) {
    slides.push(currentSlide.trim());
  }

  return slides.filter((slide) => slide.length > 0);
}

/**
 * Extract title from slide content (first ## heading)
 * @param {string} slideContent - Raw slide markdown
 * @returns {{ title: string, content: string }}
 */
function extractSlideTitle(slideContent) {
  const titleRegex = /^##\s+(.+?)(?:\n|$)/m;
  const match = slideContent.match(titleRegex);

  if (match) {
    // Remove emoji prefix if present for cleaner title
    let title = match[1].trim();
    // Keep emojis in the title but remove them for ID purposes
    const cleanTitle = title.replace(/^[\p{Emoji}\s]+/u, "").trim();

    // Remove the title line from content
    const content = slideContent.replace(titleRegex, "").trim();

    return { title: cleanTitle || title, content };
  }

  return { title: "Untitled Slide", content: slideContent };
}

/**
 * Extract code blocks from content
 * @param {string} content - Markdown content
 * @returns {{ language: string, code: string }[]}
 */
function extractCodeBlocks(content) {
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  const codeBlocks = [];
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    codeBlocks.push({
      language: match[1] || "text",
      code: match[2].trim(),
    });
  }

  return codeBlocks;
}

/**
 * Process a single markdown file and generate JSON
 * @param {string} filePath - Path to the markdown file
 */
function processFile(filePath) {
  const absolutePath = path.resolve(filePath);
  const fileName = path.basename(absolutePath);
  const dirName = path.dirname(absolutePath);

  try {
    // Read file content
    const content = fs.readFileSync(absolutePath, "utf-8");

    // Extract frontmatter and body
    const { frontmatter, body } = extractFrontmatter(content);

    // Split into slides
    const slideContents = splitIntoSlides(body);

    if (slideContents.length === 0) {
      throw new Error("No slides found. Use --- to separate slides.");
    }

    // Process each slide
    const slides = slideContents.map((slideContent, index) => {
      const { title, content: slideBody } = extractSlideTitle(slideContent);
      const codeBlocks = extractCodeBlocks(slideContent);

      // Render markdown to HTML
      const contentHtml = marked.parse(slideBody);

      return {
        id: index + 1,
        title,
        content: slideBody,
        contentHtml,
        hasCode: codeBlocks.length > 0,
        codeBlocks,
      };
    });

    // Build final JSON structure
    const output = {
      meta: {
        title: frontmatter.title,
        description: frontmatter.description,
        author: frontmatter.author,
        tags: frontmatter.tags || [],
        created: frontmatter.created || null,
        updated: frontmatter.updated || null,
        totalSlides: slides.length,
        sourceFile: fileName,
      },
      slides,
    };

    // Write JSON file
    const jsonFileName = fileName.replace(/\.md$/, ".json");
    const jsonFilePath = path.join(dirName, jsonFileName);

    fs.writeFileSync(jsonFilePath, JSON.stringify(output, null, 2), "utf-8");

    // Update stats
    stats.filesProcessed++;
    stats.totalSlides += slides.length;

    console.log(`  ✅ ${filePath} → .json (${slides.length} slides)`);

    return output;
  } catch (error) {
    stats.errors.push({ file: filePath, error: error.message });
    console.error(`  ❌ ${filePath}: ${error.message}`);
    return null;
  }
}

/**
 * Main function - process all content files
 */
async function main() {
  console.log("\n📖 Processing content files...\n");

  // Get content directory (relative to project root)
  const contentDir = path.resolve(__dirname, "..", "content");

  // Check if content directory exists
  if (!fs.existsSync(contentDir)) {
    console.error(`❌ Content directory not found: ${contentDir}`);
    process.exit(1);
  }

  // Check if a specific file was provided as argument
  const specificFile = process.argv[2];

  let files;
  if (specificFile) {
    // Process specific file
    const filePath = path.resolve(specificFile);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      process.exit(1);
    }
    files = [filePath];
  } else {
    // Find all markdown files in content directory
    const pattern = path.join(contentDir, "**", "*.md").replace(/\\/g, "/");
    files = await glob(pattern);
  }

  if (files.length === 0) {
    console.log("📭 No markdown files found in content/ directory.");
    return;
  }

  // Process each file
  for (const file of files) {
    processFile(file);
  }

  // Print summary
  const elapsed = Date.now() - stats.startTime;

  console.log("\n📊 Summary:");
  console.log(`   - Files processed: ${stats.filesProcessed}`);
  console.log(`   - Total slides: ${stats.totalSlides}`);
  console.log(`   - Errors: ${stats.errors.length}`);
  console.log(`   - Time: ${elapsed}ms\n`);

  // Exit with error code if there were errors
  if (stats.errors.length > 0) {
    console.log("Errors:");
    stats.errors.forEach(({ file, error }) => {
      console.log(`   - ${file}: ${error}`);
    });
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  console.error("Fatal error:", error.message);
  process.exit(1);
});
