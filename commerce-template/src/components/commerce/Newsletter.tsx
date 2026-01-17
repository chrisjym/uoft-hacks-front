import {
  Box,
  Heading,
  Text,
  Button,
  Input,
  Stack,
  HStack,
} from "@chakra-ui/react";
import { EditableText } from "@/components/ui/EditableText";
import { useContent } from "@/contexts/ContentContext";

export function Newsletter() {
  const { content, updateContent, colorScheme } = useContent();
  const { newsletter } = content;

  return (
    <Box py={{ base: 4, md: 6 }} h="full">
      <Box
        bg={`linear-gradient(135deg, ${colorScheme.primaryLight} 0%, rgba(168, 85, 247, 0.15) 100%)`}
        border="1px solid"
        borderColor={colorScheme.primaryBorder}
        borderRadius="2xl"
        p={{ base: 6, md: 8 }}
        backdropFilter="blur(12px)"
        shadow="xl"
        position="relative"
        overflow="hidden"
        h="full"
      >
        {/* Background decoration */}
        <Box
          position="absolute"
          top={-20}
          right={-20}
          w={40}
          h={40}
          bg={colorScheme.primaryBorder}
          borderRadius="full"
          filter="blur(40px)"
        />
        <Box
          position="absolute"
          bottom={-10}
          left={-10}
          w={32}
          h={32}
          bg="rgba(168, 85, 247, 0.3)"
          borderRadius="full"
          filter="blur(30px)"
        />

        <Stack gap={6} position="relative" textAlign="center" h="full" justify="center">
          {/* Icon */}
          <Box
            w={12}
            h={12}
            mx="auto"
            bg={colorScheme.primaryLight}
            border="1px solid"
            borderColor={colorScheme.primaryBorder}
            borderRadius="xl"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="xl"
          >
            ✉️
          </Box>

          {/* Text Content */}
          <Box>
            <Heading size="lg" color="white" fontWeight="bold" mb={2}>
              <EditableText
                value={newsletter.heading}
                onSave={(v) => updateContent("newsletter", "heading", v)}
                fontSize="lg"
                fontWeight="bold"
                color="white"
                textAlign="center"
              />
            </Heading>
            <Text fontSize="sm" color="#94a3b8" lineHeight="relaxed">
              <EditableText
                value={newsletter.description}
                onSave={(v) => updateContent("newsletter", "description", v)}
                as="textarea"
                fontSize="sm"
                color="#94a3b8"
                lineHeight="relaxed"
                textAlign="center"
              />
            </Text>
          </Box>

          {/* Email Form */}
          <Stack gap={2} w="full">
            <Input
              placeholder="Enter your email"
              bg="rgba(15, 23, 42, 0.6)"
              border="1px solid"
              borderColor="rgba(71, 85, 105, 0.5)"
              color="white"
              size="md"
              borderRadius="xl"
              _placeholder={{ color: "#64748b" }}
              _focus={{
                borderColor: colorScheme.accent,
                boxShadow: `0 0 0 1px ${colorScheme.accent}`,
              }}
            />
            <Button
              size="md"
              bg={colorScheme.primary}
              color="white"
              borderRadius="xl"
              fontWeight="semibold"
              _hover={{ bg: colorScheme.primaryHover, transform: "translateY(-2px)" }}
              transition="all 0.2s"
              shadow="lg"
            >
              <EditableText
                value={newsletter.buttonText}
                onSave={(v) => updateContent("newsletter", "buttonText", v)}
                color="white"
                fontWeight="semibold"
              />
            </Button>
          </Stack>

          {/* Privacy note */}
          <HStack justify="center" gap={2}>
            <Box w={2} h={2} bg="#22c55e" borderRadius="full" />
            <Text fontSize="xs" color="#64748b">
              <EditableText
                value={newsletter.privacyNote}
                onSave={(v) => updateContent("newsletter", "privacyNote", v)}
                fontSize="xs"
                color="#64748b"
              />
            </Text>
          </HStack>
        </Stack>
      </Box>
    </Box>
  );
}
