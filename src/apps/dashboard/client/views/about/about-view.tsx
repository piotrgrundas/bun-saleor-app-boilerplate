import { Box, Text } from "@saleor/macaw-ui";

export function AboutView() {
  const { APP_NAME, APP_VERSION } = window.env;

  return (
    <Box padding={8} display="flex" flexDirection="column" gap={4}>
      <Text as="h1" size={7}>
        {APP_NAME}
      </Text>
      <Text as="p" size={4} color="default2">
        Version {APP_VERSION}
      </Text>
    </Box>
  );
}
