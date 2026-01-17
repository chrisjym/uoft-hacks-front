import {
  Box,
  Heading,
  Text,
  Button,
  Container,
  Input,
  Stack,
  HStack,
} from "@chakra-ui/react";

export function Newsletter() {
  return (
    <Box py={{ base: 8, md: 12 }}>
      <Container maxW="container.xl">
        <Box
          bg="linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.15) 100%)"
          border="1px solid"
          borderColor="rgba(99, 102, 241, 0.3)"
          borderRadius="2xl"
          p={{ base: 8, md: 12 }}
          backdropFilter="blur(12px)"
          shadow="xl"
          position="relative"
          overflow="hidden"
        >
          {/* Background decoration */}
          <Box
            position="absolute"
            top={-20}
            right={-20}
            w={40}
            h={40}
            bg="rgba(99, 102, 241, 0.3)"
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

          <Stack gap={8} position="relative" textAlign="center" maxW="lg" mx="auto">
            {/* Icon */}
            <Box
              w={16}
              h={16}
              mx="auto"
              bg="rgba(99, 102, 241, 0.2)"
              border="1px solid"
              borderColor="rgba(99, 102, 241, 0.3)"
              borderRadius="xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="2xl"
            >
              ✉️
            </Box>

            {/* Text Content */}
            <Box>
              <Heading size="xl" color="white" fontWeight="bold" mb={3}>
                Stay in the Loop
              </Heading>
              <Text fontSize="md" color="#94a3b8" lineHeight="relaxed">
                Subscribe to our newsletter for exclusive deals, new arrivals, and
                style tips delivered straight to your inbox.
              </Text>
            </Box>

            {/* Email Form */}
            <Stack
              direction={{ base: "column", sm: "row" }}
              gap={3}
              w="full"
            >
              <Input
                placeholder="Enter your email address"
                bg="rgba(15, 23, 42, 0.6)"
                border="1px solid"
                borderColor="rgba(71, 85, 105, 0.5)"
                color="white"
                size="lg"
                flex={1}
                borderRadius="xl"
                _placeholder={{ color: "#64748b" }}
                _focus={{
                  borderColor: "#818cf8",
                  boxShadow: "0 0 0 1px #818cf8",
                }}
              />
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
                Subscribe
              </Button>
            </Stack>

            {/* Privacy note */}
            <HStack justify="center" gap={2}>
              <Box w={2} h={2} bg="#22c55e" borderRadius="full" />
              <Text fontSize="xs" color="#64748b">
                No spam, unsubscribe anytime. We respect your privacy.
              </Text>
            </HStack>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
