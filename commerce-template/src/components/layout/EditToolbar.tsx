import {
  Box,
  Button,
  HStack,
  Text,
  Menu,
  Badge,
  Portal,
} from "@chakra-ui/react";
import type { ComponentId, LayoutComponent } from "@/types";

interface EditToolbarProps {
  isEditMode: boolean;
  onToggleEditMode: () => void;
  hiddenComponents: LayoutComponent[];
  onRestoreComponent: (id: ComponentId) => void;
  onResetLayout: () => void;
}

const COMPONENT_NAMES: Record<ComponentId, string> = {
  hero: "Hero Section",
  "featured-products": "Featured Products",
  newsletter: "Newsletter",
  testimonials: "Testimonials",
  footer: "Footer",
};

export function EditToolbar({
  isEditMode,
  onToggleEditMode,
  hiddenComponents,
  onRestoreComponent,
  onResetLayout,
}: EditToolbarProps) {
  return (
    <Box
      position="fixed"
      bottom={4}
      left="50%"
      transform="translateX(-50%)"
      zIndex={1000}
      bg="gray.900"
      color="white"
      px={6}
      py={3}
      borderRadius="full"
      shadow="2xl"
    >
      <HStack gap={4}>
        <Button
          size="sm"
          colorPalette={isEditMode ? "red" : "purple"}
          onClick={onToggleEditMode}
        >
          {isEditMode ? "Exit Edit Mode" : "Edit Layout"}
        </Button>

        {isEditMode && (
          <>
            {hiddenComponents.length > 0 && (
              <Menu.Root>
                <Menu.Trigger asChild>
                  <Button size="sm" variant="outline" colorPalette="whiteAlpha">
                    Restore
                    <Badge ml={2} colorPalette="purple">
                      {hiddenComponents.length}
                    </Badge>
                  </Button>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content bg="gray.800" borderColor="gray.700">
                      {hiddenComponents.map((component) => (
                        <Menu.Item
                          key={component.id}
                          value={component.id}
                          onClick={() => onRestoreComponent(component.id)}
                          color="white"
                          _hover={{ bg: "gray.700" }}
                        >
                          {COMPONENT_NAMES[component.id]}
                        </Menu.Item>
                      ))}
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            )}

            <Button
              size="sm"
              variant="ghost"
              colorPalette="whiteAlpha"
              onClick={onResetLayout}
            >
              Reset
            </Button>

            <Text fontSize="xs" color="gray.400">
              Drag sections to reorder
            </Text>
          </>
        )}
      </HStack>
    </Box>
  );
}
