import { useState, useRef, useEffect } from "react";
import { Box, Input, Textarea } from "@chakra-ui/react";
import { useContent } from "@/contexts/ContentContext";

interface EditableTextProps {
  value: string;
  onSave: (value: string) => void;
  as?: "text" | "textarea";
  fontSize?: string | object;
  fontWeight?: string;
  color?: string;
  lineHeight?: string;
  textTransform?: string;
  letterSpacing?: string;
  fontStyle?: string;
  children?: React.ReactNode;
  minWidth?: string;
  textAlign?: "left" | "center" | "right";
}

export function EditableText({
  value,
  onSave,
  as = "text",
  fontSize,
  fontWeight,
  color,
  lineHeight,
  textTransform,
  letterSpacing,
  fontStyle,
  minWidth = "100px",
  textAlign,
}: EditableTextProps) {
  const { isEditMode } = useContent();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    if (isEditMode) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editValue !== value) {
      onSave(editValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && as === "text") {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === "Escape") {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  const commonStyles = {
    fontSize,
    fontWeight,
    color,
    lineHeight,
    textTransform,
    letterSpacing,
    fontStyle,
    textAlign,
  };

  if (isEditing) {
    const InputComponent = as === "textarea" ? Textarea : Input;
    return (
      <InputComponent
        ref={inputRef as any}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        bg="rgba(15, 23, 42, 0.8)"
        border="2px solid"
        borderColor="#818cf8"
        borderRadius="lg"
        px={2}
        py={1}
        minW={minWidth}
        w="100%"
        {...commonStyles}
        _focus={{
          boxShadow: "0 0 0 2px rgba(129, 140, 248, 0.4)",
          outline: "none",
        }}
      />
    );
  }

  return (
    <Box
      as="span"
      display="inline"
      onDoubleClick={handleDoubleClick}
      cursor={isEditMode ? "text" : "default"}
      position="relative"
      borderRadius="md"
      transition="all 0.2s"
      px={isEditMode ? 1 : 0}
      py={isEditMode ? 0.5 : 0}
      _hover={
        isEditMode
          ? {
              bg: "rgba(129, 140, 248, 0.1)",
              outline: "2px dashed rgba(129, 140, 248, 0.5)",
            }
          : {}
      }
      {...commonStyles}
    >
      {value}
    </Box>
  );
}
