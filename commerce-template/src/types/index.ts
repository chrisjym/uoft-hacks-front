// Component types for the customizable layout
export type ComponentId =
  | "hero"
  | "featured-products"
  | "newsletter"
  | "testimonials"
  | "footer";

// Grid-based layout component with position and size
export interface LayoutComponent {
  id: ComponentId;
  visible: boolean;
  // Grid positioning (12-column grid)
  gridColumn: number; // 1-12 start position
  gridColumnSpan: number; // 1-12 how many columns to span
  gridRow: number; // row position
  gridRowSpan: number; // how many rows to span
}

export interface LayoutState {
  components: LayoutComponent[];
}

// Event tracking for AI consumption
export type ComponentAction = "drag" | "remove" | "restore" | "resize" | "move";

export interface ComponentActionEvent {
  action: ComponentAction;
  componentId: ComponentId;
  oldIndex?: number;
  newIndex?: number;
  oldPosition?: { column: number; row: number };
  newPosition?: { column: number; row: number };
  timestamp: number;
}

// Product type for commerce components
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

// Testimonial type
export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
}

// Size presets for components
export type ComponentSize = "small" | "medium" | "large" | "full";

export const SIZE_PRESETS: Record<ComponentSize, { colSpan: number; rowSpan: number }> = {
  small: { colSpan: 4, rowSpan: 1 },
  medium: { colSpan: 6, rowSpan: 1 },
  large: { colSpan: 8, rowSpan: 1 },
  full: { colSpan: 12, rowSpan: 1 },
};
