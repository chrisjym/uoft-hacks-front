import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

// Editable content types
export interface EditableContent {
  hero: {
    badge: string;
    heading: string;
    headingAccent: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
  };
  newsletter: {
    heading: string;
    description: string;
    buttonText: string;
    privacyNote: string;
  };
  testimonials: {
    badge: string;
    heading: string;
    subheading: string;
  };
  featuredProducts: {
    label: string;
    heading: string;
    viewAllText: string;
  };
}

// Color scheme type
export interface ColorScheme {
  id: string;
  name: string;
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryBorder: string;
  accent: string;
  accentLight: string;
}

const DEFAULT_CONTENT: EditableContent = {
  hero: {
    badge: "New Collection",
    heading: "Discover Your",
    headingAccent: " Perfect Style",
    description: "Shop the latest trends in fashion, electronics, and home goods. Free shipping on orders over $50. Curated collections for every taste.",
    primaryButton: "Shop Now",
    secondaryButton: "Browse Catalog",
  },
  newsletter: {
    heading: "Stay in the Loop",
    description: "Subscribe to our newsletter for exclusive deals, new arrivals, and style tips delivered straight to your inbox.",
    buttonText: "Subscribe",
    privacyNote: "No spam, unsubscribe anytime. We respect your privacy.",
  },
  testimonials: {
    badge: "Testimonials",
    heading: "What Our Customers Say",
    subheading: "Don't just take our word for it — hear from our happy customers",
  },
  featuredProducts: {
    label: "Our Collection",
    heading: "Featured Products",
    viewAllText: "View All →",
  },
};

export const COLOR_SCHEMES: ColorScheme[] = [
  {
    id: "indigo",
    name: "Indigo",
    primary: "#4f46e5",
    primaryHover: "#6366f1",
    primaryLight: "rgba(99, 102, 241, 0.2)",
    primaryBorder: "rgba(99, 102, 241, 0.3)",
    accent: "#818cf8",
    accentLight: "#a78bfa",
  },
  {
    id: "emerald",
    name: "Emerald",
    primary: "#059669",
    primaryHover: "#10b981",
    primaryLight: "rgba(16, 185, 129, 0.2)",
    primaryBorder: "rgba(16, 185, 129, 0.3)",
    accent: "#34d399",
    accentLight: "#6ee7b7",
  },
  {
    id: "rose",
    name: "Rose",
    primary: "#e11d48",
    primaryHover: "#f43f5e",
    primaryLight: "rgba(244, 63, 94, 0.2)",
    primaryBorder: "rgba(244, 63, 94, 0.3)",
    accent: "#fb7185",
    accentLight: "#fda4af",
  },
  {
    id: "amber",
    name: "Amber",
    primary: "#d97706",
    primaryHover: "#f59e0b",
    primaryLight: "rgba(245, 158, 11, 0.2)",
    primaryBorder: "rgba(245, 158, 11, 0.3)",
    accent: "#fbbf24",
    accentLight: "#fcd34d",
  },
  {
    id: "cyan",
    name: "Cyan",
    primary: "#0891b2",
    primaryHover: "#06b6d4",
    primaryLight: "rgba(6, 182, 212, 0.2)",
    primaryBorder: "rgba(6, 182, 212, 0.3)",
    accent: "#22d3ee",
    accentLight: "#67e8f9",
  },
  {
    id: "violet",
    name: "Violet",
    primary: "#7c3aed",
    primaryHover: "#8b5cf6",
    primaryLight: "rgba(139, 92, 246, 0.2)",
    primaryBorder: "rgba(139, 92, 246, 0.3)",
    accent: "#a78bfa",
    accentLight: "#c4b5fd",
  },
];

const CONTENT_STORAGE_KEY = "commerce-content";
const COLOR_SCHEME_STORAGE_KEY = "commerce-color-scheme";

interface ContentContextValue {
  content: EditableContent;
  updateContent: <K extends keyof EditableContent>(
    section: K,
    field: keyof EditableContent[K],
    value: string
  ) => void;
  resetContent: () => void;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  isEditMode: boolean;
  setIsEditMode: (mode: boolean) => void;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<EditableContent>(() => {
    try {
      const saved = localStorage.getItem(CONTENT_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load content:", e);
    }
    return DEFAULT_CONTENT;
  });

  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(() => {
    try {
      const saved = localStorage.getItem(COLOR_SCHEME_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return COLOR_SCHEMES.find((s) => s.id === parsed.id) || COLOR_SCHEMES[0];
      }
    } catch (e) {
      console.error("Failed to load color scheme:", e);
    }
    return COLOR_SCHEMES[0];
  });

  const [isEditMode, setIsEditMode] = useState(false);

  // Save content to localStorage
  useEffect(() => {
    localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
  }, [content]);

  // Save color scheme to localStorage
  useEffect(() => {
    localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, JSON.stringify({ id: colorScheme.id }));
  }, [colorScheme]);

  const updateContent = useCallback(<K extends keyof EditableContent>(
    section: K,
    field: keyof EditableContent[K],
    value: string
  ) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  }, []);

  const resetContent = useCallback(() => {
    setContent(DEFAULT_CONTENT);
    localStorage.removeItem(CONTENT_STORAGE_KEY);
  }, []);

  const setColorScheme = useCallback((scheme: ColorScheme) => {
    setColorSchemeState(scheme);
  }, []);

  return (
    <ContentContext.Provider
      value={{
        content,
        updateContent,
        resetContent,
        colorScheme,
        setColorScheme,
        isEditMode,
        setIsEditMode,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
}
