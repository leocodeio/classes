import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

// Types for slide content
export interface SlideCodeBlock {
  language: string;
  code: string;
}

export interface Slide {
  id: number;
  title: string;
  content: string;
  contentHtml: string;
  hasCode: boolean;
  codeBlocks: SlideCodeBlock[];
}

export interface SlideMeta {
  title: string;
  description: string;
  author: string;
  tags: string[];
  created: string | null;
  updated: string | null;
  totalSlides: number;
  sourceFile: string;
}

export interface SlideContent {
  meta: SlideMeta;
  slides: Slide[];
}

export interface ContentItem {
  category: string;
  topic: string;
  title: string;
  description: string;
  author: string;
  tags: string[];
  totalSlides: number;
}

export interface CategoryInfo {
  category: string;
  topics: ContentItem[];
}

@Injectable()
export class ContentService {
  private readonly contentDir: string;

  constructor() {
    // Content directory is at the root of the monorepo
    // process.cwd() points to apps/api when running from there
    this.contentDir = path.resolve(process.cwd(), '..', '..', 'content');
  }

  /**
   * Get all available content items
   */
  async getAllContent(): Promise<ContentItem[]> {
    const items: ContentItem[] = [];

    if (!fs.existsSync(this.contentDir)) {
      return items;
    }

    const categories = fs
      .readdirSync(this.contentDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const category of categories) {
      const categoryPath = path.join(this.contentDir, category);
      const files = fs
        .readdirSync(categoryPath)
        .filter((file) => file.endsWith('.json'));

      for (const file of files) {
        const filePath = path.join(categoryPath, file);
        try {
          const content = JSON.parse(
            fs.readFileSync(filePath, 'utf-8'),
          ) as SlideContent;
          const topic = file.replace('.json', '');

          items.push({
            category,
            topic,
            title: content.meta.title,
            description: content.meta.description,
            author: content.meta.author,
            tags: content.meta.tags,
            totalSlides: content.meta.totalSlides,
          });
        } catch (error) {
          // Skip files that can't be parsed
          console.warn(`Failed to parse ${filePath}:`, error);
        }
      }
    }

    return items;
  }

  /**
   * Get all content items in a specific category
   */
  async getContentByCategory(category: string): Promise<CategoryInfo> {
    const categoryPath = path.join(this.contentDir, category);

    if (!fs.existsSync(categoryPath)) {
      throw new NotFoundException(`Category "${category}" not found`);
    }

    const files = fs
      .readdirSync(categoryPath)
      .filter((file) => file.endsWith('.json'));

    const topics: ContentItem[] = [];

    for (const file of files) {
      const filePath = path.join(categoryPath, file);
      try {
        const content = JSON.parse(
          fs.readFileSync(filePath, 'utf-8'),
        ) as SlideContent;
        const topic = file.replace('.json', '');

        topics.push({
          category,
          topic,
          title: content.meta.title,
          description: content.meta.description,
          author: content.meta.author,
          tags: content.meta.tags,
          totalSlides: content.meta.totalSlides,
        });
      } catch (error) {
        console.warn(`Failed to parse ${filePath}:`, error);
      }
    }

    return {
      category,
      topics,
    };
  }

  /**
   * Get specific slide content by category and topic
   */
  async getContent(category: string, topic: string): Promise<SlideContent> {
    const filePath = path.join(this.contentDir, category, `${topic}.json`);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`Content "${category}/${topic}" not found`);
    }

    try {
      const content = JSON.parse(
        fs.readFileSync(filePath, 'utf-8'),
      ) as SlideContent;
      return content;
    } catch (error) {
      throw new NotFoundException(
        `Failed to load content "${category}/${topic}"`,
      );
    }
  }

  /**
   * Get list of all categories
   */
  async getCategories(): Promise<string[]> {
    if (!fs.existsSync(this.contentDir)) {
      return [];
    }

    return fs
      .readdirSync(this.contentDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  }
}
