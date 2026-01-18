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
        // We interpret moves as SLOT-SWAPS to preserve the layout structure.
        // Slots (index):
        // 0 = hero (row1 full)
        // 1 = featured-products (row2 left wide)
        // 2 = newsletter (row2 right narrow)
        // 3 = testimonials (row3 full)
        // 4 = footer (row4 full)

        const SLOT_COUNT = 5;

        const clampSlot = (n: number) => Math.max(0, Math.min(n, SLOT_COUNT - 1));

        const desiredSlot =
          change.position === "top"
            ? 0
            : change.position === "bottom"
              ? 4
              : typeof change.position === "number"
                ? clampSlot(change.position)
                : 4;

        // Build a "slot order" of the currently visible components.
        // If the array order isn't stable, we sort by gridRow then gridColumn (like PageLayout does).
        const ordered = [...components].sort((a, b) => {
          if (a.gridRow !== b.gridRow) return a.gridRow - b.gridRow;
          return a.gridColumn - b.gridColumn;
        });

        const fromIndex = ordered.findIndex((c) => c.id === change.component);
        if (fromIndex === -1) return components;

        // Swap in the ORDERED list
        const toIndex = desiredSlot;

        const swapped = [...ordered];
        const temp = swapped[fromIndex];
        swapped[fromIndex] = swapped[toIndex];
        swapped[toIndex] = temp;

        // Now re-apply canonical grid positions for each slot to keep the nice layout shape.
        const canonicalize = (slotIndex: number, c: LayoutComponent): LayoutComponent => {
          switch (slotIndex) {
            case 0: // hero
              return { ...c, gridRow: 1, gridColumn: 1, gridColumnSpan: 12, gridRowSpan: 1 };
            case 1: // featured-products (row2-left)
              return { ...c, gridRow: 2, gridColumn: 1, gridColumnSpan: 8, gridRowSpan: 1 };
            case 2: // newsletter (row2-right)
              return { ...c, gridRow: 2, gridColumn: 9, gridColumnSpan: 4, gridRowSpan: 1 };
            case 3: // testimonials
              return { ...c, gridRow: 3, gridColumn: 1, gridColumnSpan: 12, gridRowSpan: 1 };
            case 4: // footer
              return { ...c, gridRow: 4, gridColumn: 1, gridColumnSpan: 12, gridRowSpan: 1 };
            default:
              return c;
          }
        };

        const normalized = swapped.map((c, idx) => canonicalize(idx, c));

        // Preserve visibility flags, etc. Also preserve any hidden components not in ordered list (rare).
        // Since your layout always has exactly 5 components, normalized covers all of them.
        return normalized;
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
        const validIds: ComponentId[] = ["hero", "featured-products", "testimonials", "newsletter", "footer"];
        const componentId = change.component as ComponentId;

        if (!validIds.includes(componentId)) {
          console.warn(`[AI Layout] Unknown component type: ${change.component}`);
          return components;
        }

        const exists = components.some((c) => c.id === componentId);
        if (exists) {
          return components.map((c) =>
            c.id === componentId ? { ...c, visible: true } : c
          );
        }

        const maxRow = Math.max(...components.map((c) => c.gridRow + c.gridRowSpan - 1), 0);

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
