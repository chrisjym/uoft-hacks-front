import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Stack,
  HStack,
} from "@chakra-ui/react";
import type { Testimonial } from "@/types";
import { EditableText } from "@/components/ui/EditableText";
import { useContent } from "@/contexts/ContentContext";

const SAMPLE_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Sarah J.",
    avatar: "👩",
    rating: 5,
    text: "Amazing quality and super fast shipping!",
  },
  {
    id: "2",
    name: "Mike C.",
    avatar: "👨",
    rating: 5,
    text: "Outstanding customer service.",
  },
  {
    id: "3",
    name: "Emily D.",
    avatar: "👩‍🦰",
    rating: 4,
    text: "Great selection at competitive prices.",
  },
  {
    id: "4",
    name: "James W.",
    avatar: "🧔",
    rating: 5,
    text: "Best shopping experience I've had!",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <HStack gap={0.5}>
      {[...Array(5)].map((_, i) => (
        <Text key={i} color={i < rating ? "#fbbf24" : "#374151"} fontSize="xs">
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
      borderRadius="xl"
      p={4}
      backdropFilter="blur(12px)"
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-2px)",
        borderColor: "rgba(251, 191, 36, 0.3)",
      }}
    >
      <Stack gap={3}>
        <StarRating rating={testimonial.rating} />
        <Text color="#cbd5e1" fontSize="xs" lineHeight="tall" fontStyle="italic" lineClamp={2}>
          "{testimonial.text}"
        </Text>
        <HStack gap={2} pt={2} borderTop="1px solid" borderColor="rgba(71, 85, 105, 0.3)">
          <Box
            w={8}
            h={8}
            bg="rgba(15, 23, 42, 0.6)"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="md"
          >
            {testimonial.avatar}
          </Box>
          <Box>
            <Text fontWeight="semibold" color="white" fontSize="xs">
              {testimonial.name}
            </Text>
            <Text fontSize="2xs" color="#64748b">
              Verified
            </Text>
          </Box>
        </HStack>
      </Stack>
    </Box>
  );
}

export function Testimonials() {
  const { content, updateContent } = useContent();
  const { testimonials } = content;

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
          <Box textAlign="center">
            <HStack justify="center" gap={2} mb={2}>
              <Box
                px={2}
                py={0.5}
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
                <EditableText
                  value={testimonials.badge}
                  onSave={(v) => updateContent("testimonials", "badge", v)}
                  fontSize="xs"
                  fontWeight="bold"
                  color="#fbbf24"
                  textTransform="uppercase"
                  letterSpacing="wider"
                />
              </Box>
            </HStack>
            <Heading size="lg" color="white" fontWeight="bold" mb={2}>
              <EditableText
                value={testimonials.heading}
                onSave={(v) => updateContent("testimonials", "heading", v)}
                fontWeight="bold"
                color="white"
                textAlign="center"
              />
            </Heading>
            <Text color="#64748b" fontSize="sm">
              <EditableText
                value={testimonials.subheading}
                onSave={(v) => updateContent("testimonials", "subheading", v)}
                fontSize="sm"
                color="#64748b"
                textAlign="center"
              />
            </Text>
          </Box>

          {/* Testimonials Grid */}
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={3} flex={1}>
            {SAMPLE_TESTIMONIALS.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </SimpleGrid>
        </Stack>
      </Box>
    </Box>
  );
}
