import {
  Box,
  Text,
  Container,
  SimpleGrid,
  Stack,
  Heading,
  Link,
  HStack,
} from "@chakra-ui/react";

const FOOTER_LINKS = {
  Shop: ["All Products", "New Arrivals", "Best Sellers", "Sale"],
  Support: ["Contact Us", "FAQs", "Shipping Info", "Returns"],
  Company: ["About Us", "Careers", "Press", "Blog"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

export function Footer() {
  return (
    <Box bg="gray.900" color="white" py={12}>
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={8} mb={8}>
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <Stack key={category} gap={3}>
              <Heading size="sm" textTransform="uppercase" color="gray.400">
                {category}
              </Heading>
              {links.map((link) => (
                <Link
                  key={link}
                  color="gray.300"
                  _hover={{ color: "white" }}
                  fontSize="sm"
                >
                  {link}
                </Link>
              ))}
            </Stack>
          ))}
        </SimpleGrid>

        <Box borderTop="1px solid" borderColor="gray.700" pt={8}>
          <Stack
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="center"
            gap={4}
          >
            <HStack gap={2}>
              <Text fontSize="2xl">🛒</Text>
              <Text fontWeight="bold" fontSize="xl">
                CommerceApp
              </Text>
            </HStack>
            <Text color="gray.400" fontSize="sm">
              © 2025 CommerceApp. All rights reserved.
            </Text>
            <HStack gap={4}>
              <Link fontSize="xl" _hover={{ color: "purple.400" }}>
                📘
              </Link>
              <Link fontSize="xl" _hover={{ color: "purple.400" }}>
                🐦
              </Link>
              <Link fontSize="xl" _hover={{ color: "purple.400" }}>
                📸
              </Link>
              <Link fontSize="xl" _hover={{ color: "purple.400" }}>
                💼
              </Link>
            </HStack>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
