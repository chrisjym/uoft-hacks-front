import { Box } from "@chakra-ui/react";
import { PageLayout } from "@/components/layout";

function App() {
  return (
    <Box
      minH="100vh"
      bg="linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)"
    >
      <PageLayout />
    </Box>
  );
}

export default App;
