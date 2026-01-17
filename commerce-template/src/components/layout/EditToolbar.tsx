import { useState } from "react";
import {
  Box,
  Button,
  HStack,
  Text,
  Menu,
  Badge,
  Portal,
  Textarea,
  Stack,
} from "@chakra-ui/react";
import type { ComponentId, LayoutComponent } from "@/types";
import { useContent, COLOR_SCHEMES } from "@/contexts/ContentContext";
import { useAILayoutController } from "@/hooks/useAILayoutController";

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
  const { colorScheme, setColorScheme, resetContent, setIsEditMode } = useContent();
  const { isProcessing, processAIResponse, testWithMockResponse, getCurrentStateForAI, appliedChanges } = useAILayoutController();

  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiInput, setAIInput] = useState("");
  const [aiResult, setAIResult] = useState<string | null>(null);

  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode);
    onToggleEditMode();
  };

  const handleResetAll = () => {
    onResetLayout();
    resetContent();
  };

  const handleApplyAI = async () => {
    if (!aiInput.trim()) return;

    const result = await processAIResponse(aiInput);
    if (result.success) {
      setAIResult(`Applied: ${result.appliedChanges?.join(", ") || "No changes"}`);
      setAIInput("");
    } else {
      setAIResult(`Error: ${result.error}`);
    }
  };

  const handleTestAI = async () => {
    const result = await testWithMockResponse();
    if (result.success) {
      setAIResult(`Test applied: ${result.appliedChanges?.join(", ")}`);
    }
  };

  const handleCopyState = () => {
    const state = getCurrentStateForAI();
    navigator.clipboard.writeText(JSON.stringify(state, null, 2));
    setAIResult("State copied to clipboard!");
  };

  return (
    <>
      {/* AI Panel (shown above toolbar when active) */}
      {showAIPanel && isEditMode && (
        <Box
          position="fixed"
          bottom={20}
          left="50%"
          transform="translateX(-50%)"
          zIndex={999}
          bg="rgba(15, 23, 42, 0.98)"
          backdropFilter="blur(16px)"
          color="white"
          p={4}
          borderRadius="2xl"
          shadow="0 8px 32px rgba(0, 0, 0, 0.5)"
          border="1px solid"
          borderColor={colorScheme.primaryBorder}
          w="500px"
          maxW="90vw"
        >
          <Stack gap={3}>
            <HStack justify="space-between">
              <Text fontWeight="bold" fontSize="sm" color={colorScheme.accent}>
                AI Layout Controller
              </Text>
              <Button
                size="xs"
                variant="ghost"
                color="#64748b"
                onClick={() => setShowAIPanel(false)}
              >
                Close
              </Button>
            </HStack>

            <Textarea
              value={aiInput}
              onChange={(e) => setAIInput(e.target.value)}
              placeholder='Paste AI JSON response here...&#10;{"reason": "...", "changes": [...], "theme": {...}}'
              bg="rgba(0, 0, 0, 0.3)"
              border="1px solid"
              borderColor="rgba(71, 85, 105, 0.5)"
              borderRadius="lg"
              fontSize="xs"
              fontFamily="mono"
              minH="120px"
              _focus={{
                borderColor: colorScheme.accent,
                boxShadow: `0 0 0 1px ${colorScheme.accent}`,
              }}
            />

            <HStack gap={2}>
              <Button
                size="sm"
                bg={colorScheme.primary}
                color="white"
                _hover={{ bg: colorScheme.primaryHover }}
                onClick={handleApplyAI}
                disabled={isProcessing || !aiInput.trim()}
                flex={1}
              >
                {isProcessing ? "Processing..." : "Apply Changes"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                borderColor="rgba(71, 85, 105, 0.5)"
                color="white"
                _hover={{ bg: "rgba(71, 85, 105, 0.3)" }}
                onClick={handleTestAI}
                disabled={isProcessing}
              >
                Test
              </Button>
              <Button
                size="sm"
                variant="outline"
                borderColor="rgba(71, 85, 105, 0.5)"
                color="white"
                _hover={{ bg: "rgba(71, 85, 105, 0.3)" }}
                onClick={handleCopyState}
              >
                Copy State
              </Button>
            </HStack>

            {aiResult && (
              <Box
                p={2}
                bg="rgba(0, 0, 0, 0.2)"
                borderRadius="lg"
                fontSize="xs"
                color={aiResult.startsWith("Error") ? "#ef4444" : "#22c55e"}
              >
                {aiResult}
              </Box>
            )}

            {appliedChanges.length > 0 && (
              <Box fontSize="xs" color="#64748b">
                Last changes: {appliedChanges.slice(-3).join(" | ")}
              </Box>
            )}
          </Stack>
        </Box>
      )}

      {/* Main Toolbar */}
      <Box
        position="fixed"
        bottom={4}
        left="50%"
        transform="translateX(-50%)"
        zIndex={1000}
        bg="rgba(15, 23, 42, 0.95)"
        backdropFilter="blur(12px)"
        color="white"
        px={6}
        py={3}
        borderRadius="full"
        shadow="0 8px 32px rgba(0, 0, 0, 0.4)"
        border="1px solid"
        borderColor="rgba(71, 85, 105, 0.5)"
      >
        <HStack gap={4}>
          <Button
            size="sm"
            bg={isEditMode ? "#ef4444" : colorScheme.primary}
            color="white"
            _hover={{ bg: isEditMode ? "#dc2626" : colorScheme.primaryHover }}
            onClick={handleToggleEditMode}
            borderRadius="lg"
            px={4}
          >
            {isEditMode ? "Exit Edit Mode" : "Edit Layout"}
          </Button>

          {isEditMode && (
            <>
              {/* AI Button */}
              <Button
                size="sm"
                variant="outline"
                borderColor={showAIPanel ? colorScheme.accent : "rgba(71, 85, 105, 0.5)"}
                color={showAIPanel ? colorScheme.accent : "white"}
                _hover={{ bg: "rgba(71, 85, 105, 0.3)" }}
                onClick={() => setShowAIPanel(!showAIPanel)}
                borderRadius="lg"
                px={3}
              >
                <HStack gap={2}>
                  <Text>🤖</Text>
                  <Text fontSize="sm">AI</Text>
                </HStack>
              </Button>

              {/* Color Scheme Picker */}
              <Menu.Root>
                <Menu.Trigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    borderColor="rgba(71, 85, 105, 0.5)"
                    color="white"
                    _hover={{ bg: "rgba(71, 85, 105, 0.3)" }}
                    borderRadius="lg"
                    px={3}
                  >
                    <HStack gap={2}>
                      <Box
                        w={4}
                        h={4}
                        borderRadius="full"
                        bg={colorScheme.primary}
                        border="2px solid white"
                      />
                      <Text fontSize="sm">Theme</Text>
                    </HStack>
                  </Button>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content
                      bg="rgba(15, 23, 42, 0.95)"
                      backdropFilter="blur(12px)"
                      border="1px solid"
                      borderColor="rgba(71, 85, 105, 0.5)"
                      borderRadius="xl"
                      p={2}
                      minW="180px"
                    >
                      {COLOR_SCHEMES.map((scheme) => (
                        <Menu.Item
                          key={scheme.id}
                          value={scheme.id}
                          onClick={() => setColorScheme(scheme)}
                          color="white"
                          borderRadius="lg"
                          _hover={{ bg: "rgba(71, 85, 105, 0.3)" }}
                          py={2}
                          px={3}
                        >
                          <HStack gap={3} w="full">
                            <Box
                              w={5}
                              h={5}
                              borderRadius="full"
                              bg={scheme.primary}
                              border={colorScheme.id === scheme.id ? "2px solid white" : "none"}
                            />
                            <Text fontSize="sm">{scheme.name}</Text>
                            {colorScheme.id === scheme.id && (
                              <Text ml="auto" fontSize="xs" color={scheme.accent}>
                                Active
                              </Text>
                            )}
                          </HStack>
                        </Menu.Item>
                      ))}
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>

              {hiddenComponents.length > 0 && (
                <Menu.Root>
                  <Menu.Trigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      borderColor="rgba(71, 85, 105, 0.5)"
                      color="white"
                      _hover={{ bg: "rgba(71, 85, 105, 0.3)" }}
                      borderRadius="lg"
                    >
                      Restore
                      <Badge ml={2} bg={colorScheme.primary} color="white" borderRadius="full" px={2}>
                        {hiddenComponents.length}
                      </Badge>
                    </Button>
                  </Menu.Trigger>
                  <Portal>
                    <Menu.Positioner>
                      <Menu.Content
                        bg="rgba(15, 23, 42, 0.95)"
                        backdropFilter="blur(12px)"
                        border="1px solid"
                        borderColor="rgba(71, 85, 105, 0.5)"
                        borderRadius="xl"
                        p={2}
                      >
                        {hiddenComponents.map((component) => (
                          <Menu.Item
                            key={component.id}
                            value={component.id}
                            onClick={() => onRestoreComponent(component.id)}
                            color="white"
                            borderRadius="lg"
                            _hover={{ bg: "rgba(71, 85, 105, 0.3)" }}
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
                color="#94a3b8"
                _hover={{ color: "white", bg: "rgba(71, 85, 105, 0.3)" }}
                onClick={handleResetAll}
                borderRadius="lg"
              >
                Reset All
              </Button>

              <Box h={4} w="1px" bg="rgba(71, 85, 105, 0.5)" />

              <Text fontSize="xs" color="#64748b">
                Double-click text to edit
              </Text>
            </>
          )}
        </HStack>
      </Box>
    </>
  );
}
