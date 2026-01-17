// Component types for the customizable layout
export type ComponentId =
  | "hero"
  | "featured-products"
  | "newsletter"
  | "testimonials"
  | "footer";

export interface LayoutComponent {
  id: ComponentId;
  visible: boolean;
}

export interface LayoutState {
  components: LayoutComponent[];
}

// Event tracking for AI consumption
export type ComponentAction = "drag" | "remove" | "restore";

export interface ComponentActionEvent {
  action: ComponentAction;
  componentId: ComponentId;
  oldIndex?: number;
  newIndex?: number;
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
