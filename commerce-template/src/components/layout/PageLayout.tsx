import { Box } from "@chakra-ui/react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";

import { DraggableSection } from "./DraggableSection";
import { EditToolbar } from "./EditToolbar";
import {
  Hero,
  FeaturedProducts,
  Newsletter,
  Testimonials,
  Footer,
} from "@/components/commerce";
import { useLayoutState } from "@/hooks/useLayoutState";
import type { ComponentId } from "@/types";

const COMPONENT_MAP: Record<ComponentId, React.ReactNode> = {
  hero: <Hero />,
  "featured-products": <FeaturedProducts />,
  newsletter: <Newsletter />,
  testimonials: <Testimonials />,
  footer: <Footer />,
};

export function PageLayout() {
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    visibleComponents,
    hiddenComponents,
    reorderComponents,
    removeComponent,
    restoreComponent,
    resetLayout,
  } = useLayoutState();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = visibleComponents.findIndex((c) => c.id === active.id);
      const newIndex = visibleComponents.findIndex((c) => c.id === over.id);
      reorderComponents(oldIndex, newIndex);
    }
  };

  return (
    <Box>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={visibleComponents.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <Box pt={isEditMode ? 12 : 0}>
            {visibleComponents.map((component) => (
              <DraggableSection
                key={component.id}
                id={component.id}
                onRemove={removeComponent}
                isEditMode={isEditMode}
              >
                {COMPONENT_MAP[component.id]}
              </DraggableSection>
            ))}
          </Box>
        </SortableContext>
      </DndContext>

      <EditToolbar
        isEditMode={isEditMode}
        onToggleEditMode={() => setIsEditMode(!isEditMode)}
        hiddenComponents={hiddenComponents}
        onRestoreComponent={restoreComponent}
        onResetLayout={resetLayout}
      />
    </Box>
  );
}
