import { Box, Container } from "@chakra-ui/react";
import { useState } from "react";
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
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import { GridSection } from "./GridSection";
import { EditToolbar } from "./EditToolbar";
import {
  Hero,
  FeaturedProducts,
  Newsletter,
  Testimonials,
  Footer,
} from "@/components/commerce";
import { useLayout } from "@/contexts/LayoutContext";
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
    resizeComponent,
    removeComponent,
    restoreComponent,
    resetLayout,
    maxRow,
    swapComponents,
  } = useLayout();

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
      swapComponents(active.id as ComponentId, over.id as ComponentId);
    }
  };

  // Sort by row then column for proper rendering order
  const sortedComponents = [...visibleComponents].sort((a, b) => {
    if (a.gridRow !== b.gridRow) return a.gridRow - b.gridRow;
    return a.gridColumn - b.gridColumn;
  });

  console.log(
    "[PageLayout] sortedComponents:",
    sortedComponents.map((c) => ({
      id: c.id,
      visible: c.visible,
      row: c.gridRow,
      col: c.gridColumn,
      colSpan: c.gridColumnSpan,
    }))
  );

  return (
    <Box>
      <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedComponents.map((c) => c.id)}
            strategy={rectSortingStrategy}
          >
            <Box
              display="grid"
              gridTemplateColumns="repeat(12, 1fr)"
              gridTemplateRows={`repeat(${maxRow}, auto)`}
              gap={4}
              pt={isEditMode ? 16 : 4}
              pb={24}
            >
              {sortedComponents.map((component) => (
                <GridSection
                  key={component.id}
                  component={component}
                  onRemove={removeComponent}
                  onResize={resizeComponent}
                  isEditMode={isEditMode}
                >
                  {COMPONENT_MAP[component.id]}
                </GridSection>
              ))}
            </Box>
          </SortableContext>
        </DndContext>
      </Container>

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
