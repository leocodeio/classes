import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "../components/ui/button";

// API base URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

// Types
interface SlideCodeBlock {
  language: string;
  code: string;
}

interface Slide {
  id: number;
  title: string;
  content: string;
  contentHtml: string;
  hasCode: boolean;
  codeBlocks: SlideCodeBlock[];
}

interface SlideMeta {
  title: string;
  description: string;
  author: string;
  tags: string[];
  created: string | null;
  updated: string | null;
  totalSlides: number;
  sourceFile: string;
}

interface SlideContent {
  meta: SlideMeta;
  slides: Slide[];
}

export function Slides() {
  const { category, topic } = useParams<{ category: string; topic: string }>();
  const navigate = useNavigate();

  const [content, setContent] = useState<SlideContent | null>(null);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fetch slide content
  useEffect(() => {
    async function fetchContent() {
      if (!category || !topic) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_BASE_URL}/content/${category}/${topic}`,
        );

        if (!response.ok) {
          throw new Error("Content not found");
        }

        const data = await response.json();
        setContent(data.data);
        setCurrentSlide(1);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load content");
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, [category, topic]);

  // Navigation functions
  const goToNextSlide = useCallback(() => {
    if (content && currentSlide < content.meta.totalSlides) {
      setCurrentSlide((prev) => prev + 1);
    }
  }, [content, currentSlide]);

  const goToPrevSlide = useCallback(() => {
    if (currentSlide > 1) {
      setCurrentSlide((prev) => prev - 1);
    }
  }, [currentSlide]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goToNextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevSlide();
      } else if (e.key === "Escape") {
        setIsFullscreen(false);
      } else if (e.key === "f" || e.key === "F") {
        setIsFullscreen((prev) => !prev);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNextSlide, goToPrevSlide]);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-lg text-muted-foreground">
            Loading slides...
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error || !content) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <div className="text-lg text-destructive">
            {error || "Content not found"}
          </div>
          <Button onClick={() => navigate("/")} variant="outline">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
      </Layout>
    );
  }

  const slide = content.slides[currentSlide - 1];
  const progress = (currentSlide / content.meta.totalSlides) * 100;

  // Fullscreen view
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(false)}
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-semibold">{content.meta.title}</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              {currentSlide} / {content.meta.totalSlides}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Slide content */}
        <div className="flex-1 overflow-auto p-8 md:p-12 lg:p-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              {slide.title}
            </h2>
            <div
              className="prose prose-lg dark:prose-invert max-w-none slide-content"
              dangerouslySetInnerHTML={{ __html: slide.contentHtml }}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/50">
          <Button
            variant="outline"
            onClick={goToPrevSlide}
            disabled={currentSlide === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Press <kbd className="px-2 py-1 bg-muted rounded text-xs">ESC</kbd>{" "}
            to exit fullscreen
          </div>
          <Button
            variant="outline"
            onClick={goToNextSlide}
            disabled={currentSlide === content.meta.totalSlides}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // Normal view
  return (
    <Layout>
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                <Home className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold">{content.meta.title}</h1>
                <p className="text-sm text-muted-foreground">
                  by {content.meta.author}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {currentSlide} / {content.meta.totalSlides}
              </span>
              <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-muted rounded-full mb-8">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Slide content */}
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12 min-h-[60vh] mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              {slide.title}
            </h2>
            <div
              className="prose prose-lg dark:prose-invert max-w-none slide-content"
              dangerouslySetInnerHTML={{ __html: slide.contentHtml }}
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={goToPrevSlide}
              disabled={currentSlide === 1}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs mx-1">←</kbd>
                <kbd className="px-2 py-1 bg-muted rounded text-xs mx-1">
                  →
                </kbd>{" "}
                to navigate
              </span>
              <span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">F</kbd> for
                fullscreen
              </span>
            </div>

            <Button
              variant="outline"
              onClick={goToNextSlide}
              disabled={currentSlide === content.meta.totalSlides}
              className="gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Tags */}
          {content.meta.tags.length > 0 && (
            <div className="mt-8 flex items-center gap-2 flex-wrap">
              {content.meta.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
