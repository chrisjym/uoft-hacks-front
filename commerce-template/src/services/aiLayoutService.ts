import type { ComponentId, LayoutComponent } from "@/types";
import type { ColorScheme, EditableContent } from "@/contexts/ContentContext";
import { COLOR_SCHEMES } from "@/contexts/ContentContext";

// AI Output Schema Types
export type ComponentType =
  | "hero"
  | "featured-products"
  | "testimonials"
  | "newsletter"
  | "footer"
  | "promo-banner";

export interface ThemeConfig {
  primaryColor: "indigo" | "emerald" | "rose" | "amber" | "cyan" | "violet";
  spacing: "compact" | "comfortable";
  mode: "light" | "dark";
}

export type ChangeAction =
  | { type: "move"; component: ComponentId; position: "top" | "bottom" | number }
  | { type: "remove"; component: ComponentId }
  | { type: "add"; component: ComponentType; props: Record<string, unknown> }
  | { type: "update_props"; component: ComponentId; section: keyof EditableContent; props: Record<string, string> }
  | { type: "toggle_visibility"; component: ComponentId; visible: boolean }
  | { type: "update_theme"; theme: Partial<ThemeConfig> };

export interface AILayoutResponse {
  reason: string;
  changes: ChangeAction[];
  theme?: ThemeConfig;
}

// Map theme color names to our ColorScheme objects
const THEME_COLOR_MAP: Record<ThemeConfig["primaryColor"], string> = {
  indigo: "indigo",
  emerald: "emerald",
  rose: "rose",
  amber: "amber",
  cyan: "cyan",
  violet: "violet",
};

/**
 * Validates that the AI response conforms to our expected schema
 */
export function validateAIResponse(response: unknown): response is AILayoutResponse {
  if (typeof response !== "object" || response === null) {
    return false;
  }

  const obj = response as Record<string, unknown>;

  if (typeof obj.reason !== "string") {
    return false;
  }

  if (!Array.isArray(obj.changes)) {
    return false;
  }

  for (const change of obj.changes) {
    if (typeof change !== "object" || change === null) {
      return false;
    }

    const action = change as Record<string, unknown>;

    if (!["move", "remove", "add", "update_props", "toggle_visibility", "update_theme"].includes(action.type as string)) {
      return false;
    }
  }

  return true;
}

/**
 * Applies a single change action to the layout
 */
function applyChange(
  components: LayoutComponent[],
  change: ChangeAction
): LayoutComponent[] {
  switch (change.type) {
    case "move": {
      const index = components.findIndex((c) => c.id === change.component);
      if (index === -1) return components;

      const target = components[index];

      let newRow = target.gridRow;

      if (change.position === "top") {
        newRow = 1;
      } else if (change.position === "bottom") {
        const maxRow = Math.max(...components.map((c) => c.gridRow + c.gridRowSpan - 1), 1);
        newRow = maxRow + 1;
      } else if (typeof change.position === "number") {
        // map "position index" to row number (simple mapping)
        newRow = change.position + 1;
      }

      return components.map((c) =>
        c.id === change.component ? { ...c, gridRow: newRow } : c
      );
    }

    case "remove":
    case "toggle_visibility": {
      return components.map((c) =>
        c.id === change.component
          ? { ...c, visible: change.type === "toggle_visibility" ? change.visible : false }
          : c
      );
    }

    case "add": {
      // Only add if component type is valid and not already present
      const validIds: ComponentId[] = ["hero", "featured-products", "testimonials", "newsletter", "footer"];
      const componentId = change.component as ComponentId;

      if (!validIds.includes(componentId)) {
        console.warn(`[AI Layout] Unknown component type: ${change.component}`);
        return components;
      }

      const exists = components.some((c) => c.id === componentId);
      if (exists) {
        // If it exists but is hidden, make it visible
        return components.map((c) =>
          c.id === componentId ? { ...c, visible: true } : c
        );
      }

      // Calculate next row position
      const maxRow = Math.max(...components.map((c) => c.gridRow + c.gridRowSpan - 1), 0);

      // Add new component at the end with default grid position
      const newComponent: LayoutComponent = {
        id: componentId,
        visible: true,
        gridColumn: 1,
        gridColumnSpan: 12,
        gridRow: maxRow + 1,
        gridRowSpan: 1,
      };
      return [...components, newComponent];
    }

    default:
      return components;
  }
}

/**
 * Applies content updates from AI response
 */
export function applyContentUpdates(
  content: EditableContent,
  changes: ChangeAction[]
): EditableContent {
  let updatedContent = { ...content };

  for (const change of changes) {
    if (change.type === "update_props" && change.section && change.props) {
      const section = change.section as keyof EditableContent;
      if (updatedContent[section]) {
        updatedContent = {
          ...updatedContent,
          [section]: {
            ...updatedContent[section],
            ...change.props,
          },
        };
      }
    }
  }

  return updatedContent;
}

/**
 * Gets the ColorScheme from a theme config
 */
export function getColorSchemeFromTheme(theme: ThemeConfig): ColorScheme | null {
  const schemeId = THEME_COLOR_MAP[theme.primaryColor];
  return COLOR_SCHEMES.find((s) => s.id === schemeId) || null;
}

/**
 * Main function to apply all AI-suggested changes
 */
export function applyAIChanges(
  currentComponents: LayoutComponent[],
  currentContent: EditableContent,
  currentColorScheme: ColorScheme,
  aiResponse: AILayoutResponse
): {
  components: LayoutComponent[];
  content: EditableContent;
  colorScheme: ColorScheme;
  appliedChanges: string[];
} {
  let components = [...currentComponents];
  let content = { ...currentContent };
  let colorScheme = currentColorScheme;
  const appliedChanges: string[] = [];

  // Apply layout changes
  for (const change of aiResponse.changes) {
    switch (change.type) {
      case "move":
        components = applyChange(components, change);
        appliedChanges.push(`Moved ${change.component} to ${change.position}`);
        break;

      case "remove":
        components = applyChange(components, change);
        appliedChanges.push(`Removed ${change.component}`);
        break;

      case "toggle_visibility":
        components = applyChange(components, change);
        appliedChanges.push(`${change.visible ? "Showed" : "Hid"} ${change.component}`);
        break;

      case "add":
        components = applyChange(components, change);
        appliedChanges.push(`Added ${change.component}`);
        break;

      case "update_props":
        content = applyContentUpdates(content, [change]);
        appliedChanges.push(`Updated ${change.section} content`);
        break;

      case "update_theme":
        // Theme is handled separately
        break;
    }
  }

  // Apply theme if provided
  if (aiResponse.theme) {
    const newScheme = getColorSchemeFromTheme(aiResponse.theme);
    if (newScheme) {
      colorScheme = newScheme;
      appliedChanges.push(`Changed theme to ${aiResponse.theme.primaryColor}`);
    }
  }

  console.log("[AI Layout] Applied changes:", appliedChanges);
  console.log("[AI Layout] Reason:", aiResponse.reason);

  return {
    components,
    content,
    colorScheme,
    appliedChanges,
  };
}

/**
 * Example: Generate a mock AI response for testing
 */
export function generateMockAIResponse(): AILayoutResponse {
  return {
    reason: "Optimizing layout based on user engagement patterns",
    changes: [
      { type: "move", component: "featured-products", position: "top" },
      { type: "toggle_visibility", component: "testimonials", visible: true },
    ],
    theme: {
      primaryColor: "emerald",
      spacing: "comfortable",
      mode: "dark",
    },
  };
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export async function callAiBackend(args: {
  prompt: string;
  innerHTML: string;
}): Promise<AILayoutResponse> {
  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: args.prompt,
      innerHTML: args.innerHTML,
    }),
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      if (err?.detail) detail = err.detail;
    } catch {
      // ignore
    }
    throw new Error(detail);
  }

  const data: unknown = await res.json();

  if (!validateAIResponse(data)) {
    console.error("[AI] Backend response did not match AILayoutResponse:", data);
    throw new Error("Invalid AI response shape from backend");
  }

  return data;
}
