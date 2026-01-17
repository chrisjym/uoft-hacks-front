import {
  Box,
  Text,
  SimpleGrid,
  Stack,
  Heading,
  Link,
  HStack,
} from "@chakra-ui/react";
import { useContent } from "@/contexts/ContentContext";

const FOOTER_LINKS = {
  Shop: ["Products", "New", "Sale"],
  Support: ["Contact", "FAQs", "Shipping"],
  Company: ["About", "Careers", "Blog"],
  Legal: ["Privacy", "Terms"],
};

export function Footer() {
  const { colorScheme } = useContent();

  return (
    <Box py={{ base: 4, md: 6 }} h="full">
      <Box
        bg="rgba(15, 23, 42, 0.8)"
        backdropFilter="blur(12px)"
        color="white"
        p={{ base: 4, md: 6 }}
        borderRadius="2xl"
        border="1px solid"
        borderColor="rgba(71, 85, 105, 0.5)"
        h="full"
      >
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={4} mb={6}>
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <Stack key={category} gap={2}>
              <Heading size="xs" textTransform="uppercase" color="#64748b" letterSpacing="wider">
                {category}
              </Heading>
              {links.map((link) => (
                <Link
                  key={link}
                  color="#94a3b8"
                  _hover={{ color: colorScheme.accent }}
                  fontSize="xs"
                  transition="color 0.2s"
                >
                  {link}
                </Link>
              ))}
            </Stack>
          ))}
        </SimpleGrid>

        <Box borderTop="1px solid" borderColor="rgba(71, 85, 105, 0.5)" pt={4}>
          <Stack
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="center"
            gap={3}
          >
            <HStack gap={2}>
              <Text fontSize="xl">🛒</Text>
              <Text fontWeight="bold" fontSize="md" color="white">
                CommerceApp
              </Text>
            </HStack>
            <Text color="#64748b" fontSize="xs">
              © 2025 CommerceApp
            </Text>
            <HStack gap={3}>
              <Link fontSize="lg" _hover={{ color: colorScheme.accent }} transition="color 0.2s">
                📘
              </Link>
              <Link fontSize="lg" _hover={{ color: colorScheme.accent }} transition="color 0.2s">
                🐦
              </Link>
              <Link fontSize="lg" _hover={{ color: colorScheme.accent }} transition="color 0.2s">
                📸
              </Link>
            </HStack>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
