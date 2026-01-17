import {
  Box,
  Heading,
  Text,
  Button,
  Container,
  SimpleGrid,
  Stack,
  HStack,
} from "@chakra-ui/react";
import type { Product } from "@/types";

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 79.99,
    image: "🎧",
    description: "Premium sound quality with noise cancellation",
  },
  {
    id: "2",
    name: "Smart Watch",
    price: 199.99,
    image: "⌚",
    description: "Track your fitness and stay connected",
  },
  {
    id: "3",
    name: "Laptop Backpack",
    price: 49.99,
    image: "🎒",
    description: "Durable and stylish for everyday use",
  },
  {
    id: "4",
    name: "Bluetooth Speaker",
    price: 59.99,
    image: "🔊",
    description: "Portable speaker with 360° sound",
  },
  {
    id: "5",
    name: "Desk Lamp",
    price: 34.99,
    image: "💡",
    description: "LED lamp with adjustable brightness",
  },
  {
    id: "6",
    name: "Coffee Maker",
    price: 89.99,
    image: "☕",
    description: "Brew the perfect cup every morning",
  },
];

function ProductCard({ product }: { product: Product }) {
  return (
    <Box
      bg="rgba(30, 41, 59, 0.5)"
      border="1px solid"
      borderColor="rgba(71, 85, 105, 0.5)"
      borderRadius="2xl"
      overflow="hidden"
      backdropFilter="blur(12px)"
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-4px)",
        borderColor: "rgba(99, 102, 241, 0.5)",
        shadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
      }}
    >
      {/* Product Image */}
      <Box
        h="160px"
        bg="rgba(15, 23, 42, 0.6)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize="5xl"
        position="relative"
      >
        {product.image}
        {/* Badge */}
        <Box
          position="absolute"
          top={3}
          left={3}
          px={2}
          py={0.5}
          bg="rgba(16, 185, 129, 0.2)"
          border="1px solid"
          borderColor="rgba(16, 185, 129, 0.3)"
          borderRadius="md"
          fontSize="xs"
          fontWeight="bold"
          color="#34d399"
          textTransform="uppercase"
        >
          New
        </Box>
      </Box>

      {/* Product Info */}
      <Box p={5}>
        <Stack gap={3}>
          <Heading size="md" color="white" fontWeight="semibold">
            {product.name}
          </Heading>
          <Text color="#64748b" fontSize="sm" lineHeight="tall">
            {product.description}
          </Text>
          <HStack justify="space-between" align="center" pt={2}>
            <Text fontSize="xl" fontWeight="bold" color="#818cf8">
              ${product.price.toFixed(2)}
            </Text>
            <Button
              size="sm"
              bg="rgba(99, 102, 241, 0.2)"
              color="#a5b4fc"
              border="1px solid"
              borderColor="rgba(99, 102, 241, 0.3)"
              borderRadius="lg"
              fontWeight="semibold"
              _hover={{
                bg: "#4f46e5",
                color: "white",
                borderColor: "#4f46e5",
              }}
              transition="all 0.2s"
            >
              Add to Cart
            </Button>
          </HStack>
        </Stack>
      </Box>
    </Box>
  );
}

export function FeaturedProducts() {
  return (
    <Box py={{ base: 8, md: 12 }}>
      <Container maxW="container.xl">
        <Box
          bg="rgba(30, 41, 59, 0.5)"
          border="1px solid"
          borderColor="rgba(71, 85, 105, 0.5)"
          borderRadius="2xl"
          p={{ base: 6, md: 10 }}
          backdropFilter="blur(12px)"
          shadow="xl"
        >
          <Stack gap={8}>
            {/* Section Header */}
            <HStack justify="space-between" align="flex-end" flexWrap="wrap" gap={4}>
              <Box>
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color="#64748b"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  mb={2}
                >
                  Our Collection
                </Text>
                <Heading size="2xl" color="white" fontWeight="bold">
                  Featured Products
                </Heading>
              </Box>
              <Button
                variant="ghost"
                color="#818cf8"
                fontSize="sm"
                fontWeight="semibold"
                _hover={{ bg: "rgba(99, 102, 241, 0.1)" }}
              >
                View All →
              </Button>
            </HStack>

            {/* Products Grid */}
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={6}>
              {SAMPLE_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </SimpleGrid>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
