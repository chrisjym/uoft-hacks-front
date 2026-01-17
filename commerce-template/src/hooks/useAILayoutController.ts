import { useState, useCallback } from "react";
import { useContent } from "@/contexts/ContentContext";
import { useLayoutState } from "@/hooks/useLayoutState";
import {
  type AILayoutResponse,
  validateAIResponse,
  applyAIChanges,
  generateMockAIResponse,
} from "@/services/aiLayoutService";

interface AIControllerState {
  isProcessing: boolean;
  lastResponse: AILayoutResponse | null;
  lastError: string | null;
  appliedChanges: string[];
}

export function useAILayoutController() {
  const { content, colorScheme, setColorScheme } = useContent();
  const { components } = useLayoutState();

  const [state, setState] = useState<AIControllerState>({
    isProcessing: false,
    lastResponse: null,
    lastError: null,
    appliedChanges: [],
  });

  /**
   * Process a raw AI response (JSON string or object)
   */
  const processAIResponse = useCallback(
    async (rawResponse: string | object) => {
      setState((prev) => ({ ...prev, isProcessing: true, lastError: null }));

      try {
        // Parse if string
        const parsed = typeof rawResponse === "string"
          ? JSON.parse(rawResponse)
          : rawResponse;

        // Validate
        if (!validateAIResponse(parsed)) {
          throw new Error("Invalid AI response format");
        }

        const aiResponse = parsed as AILayoutResponse;

        // Apply changes
        const result = applyAIChanges(
          components,
          content,
          colorScheme,
          aiResponse
        );

        // Update color scheme if changed
        if (result.colorScheme.id !== colorScheme.id) {
          setColorScheme(result.colorScheme);
        }

        // Apply layout changes by simulating the actions
        // Note: In a real implementation, you'd update the layout state directly
        // For now, we log the changes that would be applied

        setState({
          isProcessing: false,
          lastResponse: aiResponse,
          lastError: null,
          appliedChanges: result.appliedChanges,
        });

        return {
          success: true,
          appliedChanges: result.appliedChanges,
          reason: aiResponse.reason,
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        setState((prev) => ({
          ...prev,
          isProcessing: false,
          lastError: errorMessage,
        }));
        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [components, content, colorScheme, setColorScheme]
  );

  /**
   * Test with a mock AI response
   */
  const testWithMockResponse = useCallback(() => {
    const mockResponse = generateMockAIResponse();
    return processAIResponse(mockResponse);
  }, [processAIResponse]);

  /**
   * Build the current state for sending to AI
   */
  const getCurrentStateForAI = useCallback(() => {
    return {
      layout: {
        components: components.map((c) => ({
          id: c.id,
          visible: c.visible,
        })),
      },
      theme: {
        primaryColor: colorScheme.id,
        mode: "dark",
        spacing: "comfortable",
      },
      content: {
        hero: content.hero,
        newsletter: content.newsletter,
        testimonials: content.testimonials,
        featuredProducts: content.featuredProducts,
      },
    };
  }, [components, colorScheme, content]);

  return {
    ...state,
    processAIResponse,
    testWithMockResponse,
    getCurrentStateForAI,
  };
}
