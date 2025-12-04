import { Controller, Get, Param } from '@nestjs/common';
import {
  ContentService,
  ContentItem,
  CategoryInfo,
  SlideContent,
} from './content.service';

@Controller('content')
export class  ContentController {
  constructor(private readonly contentService: ContentService) {}

  /**
   * GET /api/content
   * List all available content across all categories
   */
  @Get()
  async getAllContent(): Promise<{ success: boolean; data: ContentItem[] }> {
    const items = await this.contentService.getAllContent();
    return {
      success: true,
      data: items,
    };
  }

  /**
   * GET /api/content/categories
   * List all available categories
   */
  @Get('categories')
  async getCategories(): Promise<{ success: boolean; data: string[] }> {
    const categories = await this.contentService.getCategories();
    return {
      success: true,
      data: categories,
    };
  }

  /**
   * GET /api/content/:category
   * List all topics in a specific category
   */
  @Get(':category')
  async getContentByCategory(
    @Param('category') category: string,
  ): Promise<{ success: boolean; data: CategoryInfo }> {
    const categoryInfo =
      await this.contentService.getContentByCategory(category);
    return {
      success: true,
      data: categoryInfo,
    };
  }

  /**
   * GET /api/content/:category/:topic
   * Get specific slide content
   */
  @Get(':category/:topic')
  async getContent(
    @Param('category') category: string,
    @Param('topic') topic: string,
  ): Promise<{ success: boolean; data: SlideContent }> {
    const content = await this.contentService.getContent(category, topic);
    return {
      success: true,
      data: content,
    };
  }
}
