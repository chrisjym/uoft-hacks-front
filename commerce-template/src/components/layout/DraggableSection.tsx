import { Box, IconButton, HStack, Text } from "@chakra-ui/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ComponentId } from "@/types";
import { useContent } from "@/contexts/ContentContext";

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
  const { colorScheme } = useContent();
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
      outline="2px dashed"
      outlineColor={colorScheme.primaryBorder}
      outlineOffset="4px"
      borderRadius="2xl"
      transition="all 0.2s"
      _hover={{
        outlineColor: colorScheme.accent,
      }}
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
          bg={colorScheme.primary}
          color="white"
          px={4}
          py={1.5}
          borderRadius="full"
          fontSize="xs"
          fontWeight="bold"
          cursor="grab"
          shadow="lg"
          transition="all 0.2s"
          _hover={{
            bg: colorScheme.primaryHover,
            transform: "translateY(-2px)",
          }}
          {...attributes}
          {...listeners}
        >
          <Text>⋮⋮</Text>
          <Text>{COMPONENT_NAMES[id]}</Text>
        </HStack>
        <IconButton
          aria-label="Remove section"
          size="xs"
          bg="#ef4444"
          color="white"
          borderRadius="full"
          onClick={() => onRemove(id)}
          _hover={{
            bg: "#dc2626",
            transform: "scale(1.1)",
          }}
          transition="all 0.2s"
        >
          ✕
        </IconButton>
      </HStack>

      {/* Component content */}
      <Box pointerEvents={isDragging ? "none" : "auto"}>{children}</Box>
    </Box>
  );
}
