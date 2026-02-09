import { Box, Text } from "@saleor/macaw-ui";

export function AppView() {
  return (
    <Box padding={8} display="flex" flexDirection="column" gap={6}>
      <Box display="flex" alignItems="center" gap={4}>
        <img src="/logo.png" alt="App Logo" style={{ width: 48, height: 48, borderRadius: 8 }} />
        <Box>
          <Text as="h1" size={7}>
            Bun Saleor App
          </Text>
          <Text as="p" size={4} color="default2">
            Boilerplate using Bun, Hono, Vite, and React
          </Text>
        </Box>
      </Box>

      <Box borderWidth={1} borderStyle="solid" borderColor="default1" borderRadius={4} padding={6}>
        <Text as="h2" size={6}>
          Getting Started
        </Text>
        <Box marginTop={4} display="flex" flexDirection="column" gap={2}>
          <Text as="p" size={4}>
            This is your Saleor Dashboard extension. Edit{" "}
            <Text as="span" size={4} fontWeight="bold">
              src/apps/handler/client/views/app/app-view.tsx
            </Text>{" "}
            to customize this view.
          </Text>
          <Text as="p" size={4} color="default2">
            The app includes a REST API for Saleor integration, a custom GraphQL API, and webhook
            handlers ready for your business logic.
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
