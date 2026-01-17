import {
  Box,
  Heading,
  Text,
  Container,
  SimpleGrid,
  Stack,
  HStack,
} from "@chakra-ui/react";
import type { Testimonial } from "@/types";

const SAMPLE_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "👩",
    rating: 5,
    text: "Amazing quality and super fast shipping! I've been a customer for 2 years and they never disappoint.",
  },
  {
    id: "2",
    name: "Mike Chen",
    avatar: "👨",
    rating: 5,
    text: "The customer service is outstanding. They helped me find exactly what I was looking for.",
  },
  {
    id: "3",
    name: "Emily Davis",
    avatar: "👩‍🦰",
    rating: 4,
    text: "Great selection of products at competitive prices. My go-to store for all my tech needs.",
  },
  {
    id: "4",
    name: "James Wilson",
    avatar: "🧔",
    rating: 5,
    text: "Best online shopping experience I've had. The website is easy to use and checkout is seamless.",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <HStack gap={0.5}>
      {[...Array(5)].map((_, i) => (
        <Text key={i} color={i < rating ? "#fbbf24" : "#374151"} fontSize="sm">
          ★
        </Text>
      ))}
    </HStack>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Box
      bg="rgba(30, 41, 59, 0.5)"
      border="1px solid"
      borderColor="rgba(71, 85, 105, 0.5)"
      borderRadius="2xl"
      p={6}
      backdropFilter="blur(12px)"
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-4px)",
        borderColor: "rgba(251, 191, 36, 0.3)",
      }}
    >
      <Stack gap={4}>
        <StarRating rating={testimonial.rating} />
        <Text color="#cbd5e1" fontSize="sm" lineHeight="tall" fontStyle="italic">
          "{testimonial.text}"
        </Text>
        <HStack gap={3} pt={2} borderTop="1px solid" borderColor="rgba(71, 85, 105, 0.3)">
          <Box
            w={10}
            h={10}
            bg="rgba(15, 23, 42, 0.6)"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="xl"
          >
            {testimonial.avatar}
          </Box>
          <Box>
            <Text fontWeight="semibold" color="white" fontSize="sm">
              {testimonial.name}
            </Text>
            <Text fontSize="xs" color="#64748b">
              Verified Customer
            </Text>
          </Box>
        </HStack>
      </Stack>
    </Box>
  );
}

export function Testimonials() {
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
            <Box textAlign="center">
              <HStack justify="center" gap={2} mb={3}>
                <Box
                  px={3}
                  py={1}
                  bg="rgba(251, 191, 36, 0.2)"
                  border="1px solid"
                  borderColor="rgba(251, 191, 36, 0.3)"
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="bold"
                  color="#fbbf24"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Testimonials
                </Box>
              </HStack>
              <Heading size="2xl" color="white" fontWeight="bold" mb={3}>
                What Our Customers Say
              </Heading>
              <Text color="#64748b" fontSize="md">
                Don't just take our word for it — hear from our happy customers
              </Text>
            </Box>

            {/* Testimonials Grid */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
              {SAMPLE_TESTIMONIALS.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </SimpleGrid>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
