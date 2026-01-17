import { Box, IconButton, HStack, Text } from "@chakra-ui/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ComponentId } from "@/types";

interface DraggableSectionProps {
  id: ComponentId;
  children: React.ReactNode;
  onRemove: (id: ComponentId) => void;
  isEditMode: boolean;
}

const COMPONENT_NAMES: Record<ComponentId, string> = {
  hero: "Hero Section",
  "featured-products": "Featured Products",
  newsletter: "Newsletter",
  testimonials: "Testimonials",
  footer: "Footer",
};

export function DraggableSection({
  id,
  children,
  onRemove,
  isEditMode,
}: DraggableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!isEditMode) {
    return <Box>{children}</Box>;
  }

  return (
    <Box
      ref={setNodeRef}
      style={style}
      position="relative"
      opacity={isDragging ? 0.5 : 1}
      outline={isEditMode ? "2px dashed" : "none"}
      outlineColor="purple.300"
      outlineOffset="4px"
      borderRadius="md"
    >
      {/* Edit mode toolbar */}
      <HStack
        position="absolute"
        top={-10}
        left={0}
        right={0}
        justify="space-between"
        px={2}
        zIndex={10}
      >
        <HStack
          bg="purple.600"
          color="white"
          px={3}
          py={1}
          borderRadius="full"
          fontSize="xs"
          fontWeight="bold"
          cursor="grab"
          {...attributes}
          {...listeners}
        >
          <Text>⋮⋮</Text>
          <Text>{COMPONENT_NAMES[id]}</Text>
        </HStack>
        <IconButton
          aria-label="Remove section"
          size="xs"
          colorPalette="red"
          borderRadius="full"
          onClick={() => onRemove(id)}
        >
          ✕
        </IconButton>
      </HStack>

      {/* Component content */}
      <Box pointerEvents={isDragging ? "none" : "auto"}>{children}</Box>
    </Box>
  );
}
