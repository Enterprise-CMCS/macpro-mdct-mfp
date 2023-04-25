// components
import { Box, Heading, Text } from "@chakra-ui/react";
import { PageTemplate } from "components";
// utils
import verbiage from "verbiage/pages/home";

export const HomePage = () => {
  const { intro } = verbiage;

  return (
    <PageTemplate sx={sx.layout} data-testid="home-view">
      <Box sx={sx.introTextBox}>
        <Heading as="h1" sx={sx.headerText}>
          {intro.header}
        </Heading>
        <Text></Text>
      </Box>
    </PageTemplate>
  );
};

const sx = {
  layout: {
    ".contentFlex": {
      marginTop: "3.5rem",
    },
  },
  introTextBox: {
    width: "100%",
    marginBottom: "2.25rem",
  },
  headerText: {
    marginBottom: "1rem",
    fontSize: "2rem",
    fontWeight: "normal",
  },
  card: {
    marginBottom: "2rem",
  },
};
