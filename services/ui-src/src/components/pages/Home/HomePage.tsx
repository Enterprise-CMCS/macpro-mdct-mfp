// components
import { Box, Heading, Link, Text } from "@chakra-ui/react";
import { PageTemplate, TemplateCard } from "components";
// utils
import verbiage from "verbiage/pages/home";

export const HomePage = () => {
  const { intro, cards } = verbiage;

  return (
    <PageTemplate sx={sx.layout} data-testid="home-view">
      <Box sx={sx.introTextBox}>
        <Heading as="h1" sx={sx.headerText}>
          {intro.header}
        </Heading>
        <Text>
          {intro.body.preLinkText}
          <Link href={intro.body.linkLocation} isExternal>
            {intro.body.linkText}
          </Link>
          {intro.body.postLinkText}
        </Text>
        <Text></Text>
      </Box>
      <TemplateCard templateName="MP" verbiage={cards.MP} cardprops={sx.card} />
      <TemplateCard
        templateName="SAR"
        verbiage={cards.SAR}
        cardprops={sx.card}
      />
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
