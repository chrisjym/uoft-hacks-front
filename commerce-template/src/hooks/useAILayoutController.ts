import { useState, useCallback } from "react";
import { useContent } from "@/contexts/ContentContext";
import { useLayout } from "@/contexts/LayoutContext";
import {
  type AILayoutResponse,
  validateAIResponse,
  applyAIChanges,
  generateMockAIResponse,
  callAiBackend,
} from "@/services/aiLayoutService";

interface AIControllerState {
  isProcessing: boolean;
  lastResponse: AILayoutResponse | null;
  lastError: string | null;
  appliedChanges: string[];
}

export function useAILayoutController() {
  const { content, colorScheme, setColorScheme } = useContent();
  const { components, setComponents } = useLayout();

  const [state, setState] = useState<AIControllerState>({
    isProcessing: false,
    lastResponse: null,
    lastError: null,
    appliedChanges: [],
  });

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

  /**
   * Call backend AI with a user prompt
   */
  const runAI = useCallback(
    async (prompt: string) => {
      setState((prev) => ({ ...prev, isProcessing: true, lastError: null }));

      try {
        const currentState = getCurrentStateForAI();

        const aiResponse = await callAiBackend({
          prompt,
          innerHTML: JSON.stringify(currentState), // temporary payload shape
        });

        if (!validateAIResponse(aiResponse)) {
          throw new Error("Invalid AI response format");
        }

        const result = applyAIChanges(components, content, colorScheme, aiResponse);

        if (result.colorScheme.id !== colorScheme.id) {
          setColorScheme(result.colorScheme);
        }

        // APPLY to UI
        setComponents(result.components);

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
        return { success: false, error: errorMessage };
      }
    },
    [
      components,
      content,
      colorScheme,
      setColorScheme,
      setComponents,
      getCurrentStateForAI,
    ]
  );

  /**
   * Process a raw AI response (JSON string or object)
   * (kept for debugging / testing)
   */
  const processAIResponse = useCallback(
    async (rawResponse: string | object) => {
      setState((prev) => ({ ...prev, isProcessing: true, lastError: null }));

      try {
        const parsed = typeof rawResponse === "string" ? JSON.parse(rawResponse) : rawResponse;

        if (!validateAIResponse(parsed)) {
          throw new Error("Invalid AI response format");
        }

        const aiResponse = parsed as AILayoutResponse;

        const result = applyAIChanges(components, content, colorScheme, aiResponse);

        if (result.colorScheme.id !== colorScheme.id) {
          setColorScheme(result.colorScheme);
        }

        // APPLY to UI (you were missing this)
        setComponents(result.components);

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
        return { success: false, error: errorMessage };
      }
    },
    [components, content, colorScheme, setColorScheme, setComponents]
  );

  /**
   * Test with a mock AI response
   */
  const testWithMockResponse = useCallback(() => {
    const mockResponse = generateMockAIResponse();
    return processAIResponse(mockResponse);
  }, [processAIResponse]);

  return {
    ...state,
    runAI,
    processAIResponse,
    testWithMockResponse,
    getCurrentStateForAI,
  };
}
