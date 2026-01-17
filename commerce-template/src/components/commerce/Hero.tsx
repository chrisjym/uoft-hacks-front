import {
  Box,
  Heading,
  Text,
  Button,
  Container,
  Stack,
  HStack,
} from "@chakra-ui/react";

export function Hero() {
  return (
    <Box py={{ base: 8, md: 12 }}>
      <Container maxW="container.xl">
        <Box
          bg="rgba(30, 41, 59, 0.5)"
          border="1px solid"
          borderColor="rgba(71, 85, 105, 0.5)"
          borderRadius="2xl"
          p={{ base: 8, md: 12 }}
          backdropFilter="blur(12px)"
          shadow="xl"
        >
          <Stack
            direction={{ base: "column", lg: "row" }}
            align="center"
            justify="space-between"
            gap={10}
          >
            <Box maxW="xl">
              <HStack gap={2} mb={4}>
                <Box
                  px={3}
                  py={1}
                  bg="rgba(99, 102, 241, 0.2)"
                  border="1px solid"
                  borderColor="rgba(99, 102, 241, 0.3)"
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="bold"
                  color="#818cf8"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  New Collection
                </Box>
              </HStack>
              <Heading
                as="h1"
                fontSize={{ base: "3xl", md: "5xl" }}
                fontWeight="bold"
                color="white"
                mb={4}
                lineHeight="1.1"
              >
                Discover Your
                <Text as="span" color="#a78bfa">
                  {" "}
                  Perfect Style
                </Text>
              </Heading>
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color="white"
                mb={8}
                lineHeight="relaxed"
              >
                Shop the latest trends in fashion, electronics, and home goods.
                Free shipping on orders over $50. Curated collections for every
                taste.
              </Text>
              <Stack direction={{ base: "column", sm: "row" }} gap={4}>
                <Button
                  size="lg"
                  bg="#4f46e5"
                  color="white"
                  px={8}
                  borderRadius="xl"
                  fontWeight="semibold"
                  _hover={{ bg: "#6366f1", transform: "translateY(-2px)" }}
                  transition="all 0.2s"
                  shadow="lg"
                >
                  Shop Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  borderColor="#475569"
                  color="#cbd5e1"
                  px={8}
                  borderRadius="xl"
                  fontWeight="semibold"
                  _hover={{ bg: "#1e293b", borderColor: "#64748b" }}
                  transition="all 0.2s"
                >
                  Browse Catalog
                </Button>
              </Stack>
            </Box>

            {/* Hero Visual */}
            <Box
              position="relative"
              w={{ base: "full", lg: "400px" }}
              h={{ base: "280px", lg: "350px" }}
            >
              <Box
                position="absolute"
                inset={0}
                bg="linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(168, 85, 247, 0.2) 100%)"
                borderRadius="2xl"
                border="1px solid"
                borderColor="rgba(99, 102, 241, 0.2)"
              />
              <Box
                position="absolute"
                inset={4}
                bg="rgba(15, 23, 42, 0.8)"
                borderRadius="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="7xl"
              >
                🛍️
              </Box>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
