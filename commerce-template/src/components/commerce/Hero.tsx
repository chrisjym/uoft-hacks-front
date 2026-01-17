import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  HStack,
} from "@chakra-ui/react";
import { EditableText } from "@/components/ui/EditableText";
import { useContent } from "@/contexts/ContentContext";

export function Hero() {
  const { content, updateContent, colorScheme } = useContent();
  const { hero } = content;

  return (
    <Box py={{ base: 4, md: 6 }} h="full">
      <Box
        bg="rgba(30, 41, 59, 0.5)"
        border="1px solid"
        borderColor="rgba(71, 85, 105, 0.5)"
        borderRadius="2xl"
        p={{ base: 6, md: 8 }}
        backdropFilter="blur(12px)"
        shadow="xl"
        h="full"
      >
        <Stack
          direction={{ base: "column", lg: "row" }}
          align="center"
          justify="space-between"
          gap={6}
          h="full"
        >
          <Box flex={1}>
            <HStack gap={2} mb={3}>
              <Box
                px={3}
                py={1}
                bg={colorScheme.primaryLight}
                border="1px solid"
                borderColor={colorScheme.primaryBorder}
                borderRadius="full"
                fontSize="xs"
                fontWeight="bold"
                color={colorScheme.accent}
                textTransform="uppercase"
                letterSpacing="wider"
              >
                <EditableText
                  value={hero.badge}
                  onSave={(v) => updateContent("hero", "badge", v)}
                  fontSize="xs"
                  fontWeight="bold"
                  color={colorScheme.accent}
                  textTransform="uppercase"
                  letterSpacing="wider"
                />
              </Box>
            </HStack>
            <Heading
              as="h1"
              fontSize={{ base: "2xl", md: "4xl" }}
              fontWeight="bold"
              color="white"
              mb={3}
              lineHeight="1.1"
            >
              <EditableText
                value={hero.heading}
                onSave={(v) => updateContent("hero", "heading", v)}
                fontSize={{ base: "2xl", md: "4xl" }}
                fontWeight="bold"
                color="white"
                lineHeight="1.1"
              />
              <Text as="span" color={colorScheme.accentLight}>
                <EditableText
                  value={hero.headingAccent}
                  onSave={(v) => updateContent("hero", "headingAccent", v)}
                  color={colorScheme.accentLight}
                />
              </Text>
            </Heading>
            <Text
              fontSize={{ base: "sm", md: "md" }}
              color="#94a3b8"
              mb={6}
              lineHeight="relaxed"
            >
              <EditableText
                value={hero.description}
                onSave={(v) => updateContent("hero", "description", v)}
                as="textarea"
                fontSize={{ base: "sm", md: "md" }}
                color="#94a3b8"
                lineHeight="relaxed"
              />
            </Text>
            <Stack direction={{ base: "column", sm: "row" }} gap={3}>
              <Button
                size="md"
                bg={colorScheme.primary}
                color="white"
                px={6}
                borderRadius="xl"
                fontWeight="semibold"
                _hover={{ bg: colorScheme.primaryHover, transform: "translateY(-2px)" }}
                transition="all 0.2s"
                shadow="lg"
              >
                <EditableText
                  value={hero.primaryButton}
                  onSave={(v) => updateContent("hero", "primaryButton", v)}
                  color="white"
                  fontWeight="semibold"
                />
              </Button>
              <Button
                size="md"
                variant="outline"
                borderColor="#475569"
                color="#cbd5e1"
                px={6}
                borderRadius="xl"
                fontWeight="semibold"
                _hover={{ bg: "#1e293b", borderColor: "#64748b" }}
                transition="all 0.2s"
              >
                <EditableText
                  value={hero.secondaryButton}
                  onSave={(v) => updateContent("hero", "secondaryButton", v)}
                  color="#cbd5e1"
                  fontWeight="semibold"
                />
              </Button>
            </Stack>
          </Box>

          {/* Hero Visual */}
          <Box
            position="relative"
            w={{ base: "full", lg: "280px" }}
            h={{ base: "200px", lg: "250px" }}
            flexShrink={0}
          >
            <Box
              position="absolute"
              inset={0}
              bg={`linear-gradient(135deg, ${colorScheme.primaryBorder} 0%, ${colorScheme.primaryLight} 100%)`}
              borderRadius="2xl"
              border="1px solid"
              borderColor={colorScheme.primaryLight}
            />
            <Box
              position="absolute"
              inset={4}
              bg="rgba(15, 23, 42, 0.8)"
              borderRadius="xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="6xl"
            >
              🛍️
            </Box>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
