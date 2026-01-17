import {
  Box,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Stack,
  HStack,
} from "@chakra-ui/react";
import type { Product } from "@/types";
import { EditableText } from "@/components/ui/EditableText";
import { useContent } from "@/contexts/ContentContext";

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 79.99,
    image: "🎧",
    description: "Premium sound quality",
  },
  {
    id: "2",
    name: "Smart Watch",
    price: 199.99,
    image: "⌚",
    description: "Track your fitness",
  },
  {
    id: "3",
    name: "Laptop Backpack",
    price: 49.99,
    image: "🎒",
    description: "Durable and stylish",
  },
  {
    id: "4",
    name: "Bluetooth Speaker",
    price: 59.99,
    image: "🔊",
    description: "Portable 360° sound",
  },
  {
    id: "5",
    name: "Desk Lamp",
    price: 34.99,
    image: "💡",
    description: "LED adjustable",
  },
  {
    id: "6",
    name: "Coffee Maker",
    price: 89.99,
    image: "☕",
    description: "Perfect brew",
  },
];

function ProductCard({ product, colorScheme, compact }: { product: Product; colorScheme: any; compact?: boolean }) {
  return (
    <Box
      bg="rgba(30, 41, 59, 0.5)"
      border="1px solid"
      borderColor="rgba(71, 85, 105, 0.5)"
      borderRadius="xl"
      overflow="hidden"
      backdropFilter="blur(12px)"
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-2px)",
        borderColor: colorScheme.primaryBorder,
        shadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
      }}
    >
      {/* Product Image */}
      <Box
        h={compact ? "80px" : "120px"}
        bg="rgba(15, 23, 42, 0.6)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize={compact ? "3xl" : "4xl"}
        position="relative"
      >
        {product.image}
        <Box
          position="absolute"
          top={2}
          left={2}
          px={1.5}
          py={0.5}
          bg="rgba(16, 185, 129, 0.2)"
          border="1px solid"
          borderColor="rgba(16, 185, 129, 0.3)"
          borderRadius="md"
          fontSize="2xs"
          fontWeight="bold"
          color="#34d399"
          textTransform="uppercase"
        >
          New
        </Box>
      </Box>

      {/* Product Info */}
      <Box p={compact ? 3 : 4}>
        <Stack gap={2}>
          <Heading size={compact ? "sm" : "md"} color="white" fontWeight="semibold" lineClamp={1}>
            {product.name}
          </Heading>
          {!compact && (
            <Text color="#64748b" fontSize="xs" lineHeight="tall" lineClamp={1}>
              {product.description}
            </Text>
          )}
          <HStack justify="space-between" align="center">
            <Text fontSize={compact ? "md" : "lg"} fontWeight="bold" color={colorScheme.accent}>
              ${product.price.toFixed(2)}
            </Text>
            <Button
              size="xs"
              bg={colorScheme.primaryLight}
              color={colorScheme.accentLight}
              border="1px solid"
              borderColor={colorScheme.primaryBorder}
              borderRadius="lg"
              fontWeight="semibold"
              _hover={{
                bg: colorScheme.primary,
                color: "white",
              }}
              transition="all 0.2s"
            >
              Add
            </Button>
          </HStack>
        </Stack>
      </Box>
    </Box>
  );
}

export function FeaturedProducts() {
  const { content, updateContent, colorScheme } = useContent();
  const { featuredProducts } = content;

  return (
    <Box py={{ base: 4, md: 6 }} h="full">
      <Box
        bg="rgba(30, 41, 59, 0.5)"
        border="1px solid"
        borderColor="rgba(71, 85, 105, 0.5)"
        borderRadius="2xl"
        p={{ base: 4, md: 6 }}
        backdropFilter="blur(12px)"
        shadow="xl"
        h="full"
      >
        <Stack gap={4} h="full">
          {/* Section Header */}
          <HStack justify="space-between" align="flex-end" flexWrap="wrap" gap={2}>
            <Box>
              <Text
                fontSize="xs"
                fontWeight="bold"
                color="#64748b"
                textTransform="uppercase"
                letterSpacing="wider"
                mb={1}
              >
                <EditableText
                  value={featuredProducts.label}
                  onSave={(v) => updateContent("featuredProducts", "label", v)}
                  fontSize="xs"
                  fontWeight="bold"
                  color="#64748b"
                  textTransform="uppercase"
                  letterSpacing="wider"
                />
              </Text>
              <Heading size="lg" color="white" fontWeight="bold">
                <EditableText
                  value={featuredProducts.heading}
                  onSave={(v) => updateContent("featuredProducts", "heading", v)}
                  fontWeight="bold"
                  color="white"
                />
              </Heading>
            </Box>
            <Button
              variant="ghost"
              color={colorScheme.accent}
              fontSize="xs"
              fontWeight="semibold"
              size="sm"
              _hover={{ bg: colorScheme.primaryLight }}
            >
              <EditableText
                value={featuredProducts.viewAllText}
                onSave={(v) => updateContent("featuredProducts", "viewAllText", v)}
                fontSize="xs"
                fontWeight="semibold"
                color={colorScheme.accent}
              />
            </Button>
          </HStack>

          {/* Products Grid - responsive columns */}
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={3} flex={1}>
            {SAMPLE_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} colorScheme={colorScheme} compact />
            ))}
          </SimpleGrid>
        </Stack>
      </Box>
    </Box>
  );
}
