import { useState, useEffect, useCallback } from "react";
import type {
  LayoutState,
  LayoutComponent,
  ComponentId,
  ComponentActionEvent,
} from "@/types";

const STORAGE_KEY = "commerce-layout-state-v2";
const EVENTS_KEY = "commerce-layout-events";

// Default grid layout - 12 column grid
const DEFAULT_LAYOUT: LayoutComponent[] = [
  { id: "hero", visible: true, gridColumn: 1, gridColumnSpan: 12, gridRow: 1, gridRowSpan: 1 },
  { id: "featured-products", visible: true, gridColumn: 1, gridColumnSpan: 8, gridRow: 2, gridRowSpan: 1 },
  { id: "newsletter", visible: true, gridColumn: 9, gridColumnSpan: 4, gridRow: 2, gridRowSpan: 1 },
  { id: "testimonials", visible: true, gridColumn: 1, gridColumnSpan: 12, gridRow: 3, gridRowSpan: 1 },
  { id: "footer", visible: true, gridColumn: 1, gridColumnSpan: 12, gridRow: 4, gridRowSpan: 1 },
];

export function useLayoutState() {
  const [components, setComponents] = useState<LayoutComponent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: LayoutState = JSON.parse(saved);
        // Ensure all components have grid properties (migration)
        return parsed.components.map((c) => ({
          ...c,
          gridColumn: c.gridColumn ?? 1,
          gridColumnSpan: c.gridColumnSpan ?? 12,
          gridRow: c.gridRow ?? 1,
          gridRowSpan: c.gridRowSpan ?? 1,
        }));
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
      oldPosition?: { column: number; row: number },
      newPosition?: { column: number; row: number }
    ) => {
      const event: ComponentActionEvent = {
        action,
        componentId,
        oldPosition,
        newPosition,
        timestamp: Date.now(),
      };

      console.log("[Layout Event]", event);
      setEvents((prev) => [...prev.slice(-99), event]);
    },
    []
  );

  // Move component to a new grid position
  const moveComponent = useCallback(
    (componentId: ComponentId, gridColumn: number, gridRow: number) => {
      setComponents((prev) => {
        const component = prev.find((c) => c.id === componentId);
        if (!component) return prev;

        const oldPosition = { column: component.gridColumn, row: component.gridRow };
        const newPosition = { column: gridColumn, row: gridRow };

        trackEvent("move", componentId, oldPosition, newPosition);

        return prev.map((c) =>
          c.id === componentId ? { ...c, gridColumn, gridRow } : c
        );
      });
    },
    [trackEvent]
  );

  // Resize component (change column span)
  const resizeComponent = useCallback(
    (componentId: ComponentId, gridColumnSpan: number, gridRowSpan?: number) => {
      setComponents((prev) => {
        const component = prev.find((c) => c.id === componentId);
        if (!component) return prev;

        trackEvent("resize", componentId);

        return prev.map((c) =>
          c.id === componentId
            ? {
                ...c,
                gridColumnSpan: Math.min(Math.max(gridColumnSpan, 1), 12),
                gridRowSpan: gridRowSpan ?? c.gridRowSpan,
              }
            : c
        );
      });
    },
    [trackEvent]
  );

  // Update component grid position and size in one operation
  const updateComponentGrid = useCallback(
    (
      componentId: ComponentId,
      updates: Partial<Pick<LayoutComponent, "gridColumn" | "gridColumnSpan" | "gridRow" | "gridRowSpan">>
    ) => {
      setComponents((prev) =>
        prev.map((c) =>
          c.id === componentId
            ? {
                ...c,
                gridColumn: updates.gridColumn ?? c.gridColumn,
                gridColumnSpan: Math.min(Math.max(updates.gridColumnSpan ?? c.gridColumnSpan, 1), 12),
                gridRow: updates.gridRow ?? c.gridRow,
                gridRowSpan: updates.gridRowSpan ?? c.gridRowSpan,
              }
            : c
        )
      );
    },
    []
  );

  // Legacy reorder (for compatibility)
  const reorderComponents = useCallback(
    (oldIndex: number, newIndex: number) => {
      setComponents((prev) => {
        const newComponents = [...prev];
        const [removed] = newComponents.splice(oldIndex, 1);
        newComponents.splice(newIndex, 0, removed);
        return newComponents;
      });
    },
    []
  );

  // Remove a component (set visible to false)
  const removeComponent = useCallback(
    (componentId: ComponentId) => {
      setComponents((prev) =>
        prev.map((c) => (c.id === componentId ? { ...c, visible: false } : c))
      );
      trackEvent("remove", componentId);
    },
    [trackEvent]
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

  // Swap grid positions between two components
  const swapComponents = useCallback(
    (componentIdA: ComponentId, componentIdB: ComponentId) => {
      setComponents((prev) => {
        const compA = prev.find((c) => c.id === componentIdA);
        const compB = prev.find((c) => c.id === componentIdB);

        if (!compA || !compB) return prev;

        // Swap their grid positions
        return prev.map((c) => {
          if (c.id === componentIdA) {
            return {
              ...c,
              gridColumn: compB.gridColumn,
              gridColumnSpan: compB.gridColumnSpan,
              gridRow: compB.gridRow,
              gridRowSpan: compB.gridRowSpan,
            };
          }
          if (c.id === componentIdB) {
            return {
              ...c,
              gridColumn: compA.gridColumn,
              gridColumnSpan: compA.gridColumnSpan,
              gridRow: compA.gridRow,
              gridRowSpan: compA.gridRowSpan,
            };
          }
          return c;
        });
      });

      trackEvent("drag", componentIdA);
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

  // Calculate the max row for grid height
  const maxRow = Math.max(...components.map((c) => c.gridRow + c.gridRowSpan - 1), 1);

  return {
    components,
    visibleComponents,
    hiddenComponents,
    events,
    maxRow,
    reorderComponents,
    moveComponent,
    resizeComponent,
    updateComponentGrid,
    swapComponents,
    removeComponent,
    restoreComponent,
    resetLayout,
  };
}
