import { useState } from "react";
import { Box, IconButton, HStack, Text, Menu, Portal } from "@chakra-ui/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ComponentId, LayoutComponent } from "@/types";
import { useContent } from "@/contexts/ContentContext";

interface GridSectionProps {
  component: LayoutComponent;
  children: React.ReactNode;
  onRemove: (id: ComponentId) => void;
  onResize: (id: ComponentId, colSpan: number) => void;
  isEditMode: boolean;
}

const COMPONENT_NAMES: Record<ComponentId, string> = {
  hero: "Hero",
  "featured-products": "Products",
  newsletter: "Newsletter",
  testimonials: "Reviews",
  footer: "Footer",
};

const SIZE_OPTIONS = [
  { label: "Small (4 cols)", value: 4 },
  { label: "Medium (6 cols)", value: 6 },
  { label: "Large (8 cols)", value: 8 },
  { label: "Full (12 cols)", value: 12 },
];

export function GridSection({
  component,
  children,
  onRemove,
  onResize,
  isEditMode,
}: GridSectionProps) {
  const { colorScheme } = useContent();
  const [isHovered, setIsHovered] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id });

  // Calculate grid styles
  const gridStyle = {
    gridColumn: `${component.gridColumn} / span ${component.gridColumnSpan}`,
    gridRow: `${component.gridRow} / span ${component.gridRowSpan}`,
  };

  // Drag transform styles
  const dragStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!isEditMode) {
    return (
      <Box style={gridStyle} minH="100px">
        {children}
      </Box>
    );
  }

  return (
    <Box
      ref={setNodeRef}
      style={{ ...gridStyle, ...dragStyle }}
      position="relative"
      minH="100px"
      outline="2px dashed"
      outlineColor={isDragging ? colorScheme.accent : isHovered ? colorScheme.accent : colorScheme.primaryBorder}
      outlineOffset="4px"
      borderRadius="2xl"
      transition="outline-color 0.2s"
      opacity={isDragging ? 0.5 : 1}
      zIndex={isDragging ? 100 : 1}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        opacity={isHovered || isDragging ? 1 : 0.7}
        transition="opacity 0.2s"
      >
        <HStack gap={1}>
          {/* Draggable handle with component name */}
          <HStack
            bg={colorScheme.primary}
            color="white"
            px={3}
            py={1}
            borderRadius="full"
            fontSize="xs"
            fontWeight="bold"
            shadow="lg"
            cursor="grab"
            transition="all 0.2s"
            _hover={{
              bg: colorScheme.primaryHover,
              transform: "translateY(-2px)",
            }}
            _active={{
              cursor: "grabbing",
            }}
            {...attributes}
            {...listeners}
          >
            <Text>⋮⋮</Text>
            <Text>{COMPONENT_NAMES[component.id]}</Text>
          </HStack>

          {/* Size picker */}
          <Menu.Root>
            <Menu.Trigger asChild>
              <Box
                as="button"
                bg="rgba(15, 23, 42, 0.9)"
                color="white"
                px={2}
                py={1}
                borderRadius="full"
                fontSize="xs"
                fontWeight="medium"
                border="1px solid"
                borderColor="rgba(71, 85, 105, 0.5)"
                cursor="pointer"
                _hover={{ bg: "rgba(30, 41, 59, 0.9)" }}
              >
                {component.gridColumnSpan} cols
              </Box>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content
                  bg="rgba(15, 23, 42, 0.95)"
                  backdropFilter="blur(12px)"
                  border="1px solid"
                  borderColor="rgba(71, 85, 105, 0.5)"
                  borderRadius="xl"
                  p={1}
                  minW="140px"
                >
                  {SIZE_OPTIONS.map((option) => (
                    <Menu.Item
                      key={option.value}
                      value={String(option.value)}
                      onClick={() => onResize(component.id, option.value)}
                      color="white"
                      borderRadius="lg"
                      fontSize="xs"
                      _hover={{ bg: "rgba(71, 85, 105, 0.3)" }}
                      py={1.5}
                      px={2}
                    >
                      <HStack justify="space-between" w="full">
                        <Text>{option.label}</Text>
                        {component.gridColumnSpan === option.value && (
                          <Text color={colorScheme.accent}>✓</Text>
                        )}
                      </HStack>
                    </Menu.Item>
                  ))}
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </HStack>

        {/* Remove button */}
        <IconButton
          aria-label="Remove section"
          size="xs"
          bg="#ef4444"
          color="white"
          borderRadius="full"
          onClick={() => onRemove(component.id)}
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
