import { useState, useEffect, useCallback } from "react";
import type {
  LayoutState,
  LayoutComponent,
  ComponentId,
  ComponentActionEvent,
} from "@/types";

const STORAGE_KEY = "commerce-layout-state";
const EVENTS_KEY = "commerce-layout-events";

const DEFAULT_LAYOUT: LayoutComponent[] = [
  { id: "hero", visible: true },
  { id: "featured-products", visible: true },
  { id: "newsletter", visible: true },
  { id: "testimonials", visible: true },
  { id: "footer", visible: true },
];

export function useLayoutState() {
  const [components, setComponents] = useState<LayoutComponent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: LayoutState = JSON.parse(saved);
        return parsed.components;
      }
    } catch (e) {
      console.error("Failed to load layout state:", e);
    }
    return DEFAULT_LAYOUT;
  });

  const [events, setEvents] = useState<ComponentActionEvent[]>(() => {
    try {
      const saved = localStorage.getItem(EVENTS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load events:", e);
    }
    return [];
  });

  // Save to localStorage whenever components change
  useEffect(() => {
    const state: LayoutState = { components };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [components]);

  // Save events to localStorage
  useEffect(() => {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  }, [events]);

  // Track an action event
  const trackEvent = useCallback(
    (
      action: ComponentActionEvent["action"],
      componentId: ComponentId,
      oldIndex?: number,
      newIndex?: number
    ) => {
      const event: ComponentActionEvent = {
        action,
        componentId,
        oldIndex,
        newIndex,
        timestamp: Date.now(),
      };

      // Log to console for AI consumption
      console.log("[Layout Event]", event);

      setEvents((prev) => [...prev.slice(-99), event]); // Keep last 100 events
    },
    []
  );

  // Reorder components after drag
  const reorderComponents = useCallback(
    (oldIndex: number, newIndex: number) => {
      setComponents((prev) => {
        const newComponents = [...prev];
        const [removed] = newComponents.splice(oldIndex, 1);
        newComponents.splice(newIndex, 0, removed);

        trackEvent("drag", removed.id, oldIndex, newIndex);

        return newComponents;
      });
    },
    [trackEvent]
  );

  // Remove a component (set visible to false)
  const removeComponent = useCallback(
    (componentId: ComponentId) => {
      const index = components.findIndex((c) => c.id === componentId);
      setComponents((prev) =>
        prev.map((c) => (c.id === componentId ? { ...c, visible: false } : c))
      );
      trackEvent("remove", componentId, index);
    },
    [components, trackEvent]
  );

  // Restore a component
  const restoreComponent = useCallback(
    (componentId: ComponentId) => {
      setComponents((prev) =>
        prev.map((c) => (c.id === componentId ? { ...c, visible: true } : c))
      );
      trackEvent("restore", componentId);
    },
    [trackEvent]
  );

  // Reset to default layout
  const resetLayout = useCallback(() => {
    setComponents(DEFAULT_LAYOUT);
    setEvents([]);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(EVENTS_KEY);
  }, []);

  // Get visible components only
  const visibleComponents = components.filter((c) => c.visible);

  // Get hidden components
  const hiddenComponents = components.filter((c) => !c.visible);

  return {
    components,
    visibleComponents,
    hiddenComponents,
    events,
    reorderComponents,
    removeComponent,
    restoreComponent,
    resetLayout,
  };
}
