import { useFlags } from "launchdarkly-react-client-sdk";
// components
import { Box, Collapse, Heading, Link, Text } from "@chakra-ui/react";
import {
  AdminDashSelector,
  Banner,
  PageTemplate,
  TemplateCard,
} from "components";
// utils
import verbiage from "verbiage/pages/home";
import { useEffect } from "react";
import { checkDateRangeStatus, useStore } from "utils";

export const HomePage = () => {
  const { bannerData, bannerActive, setBannerActive } = useStore();
  const { userIsEndUser } = useStore().user ?? {};

  useEffect(() => {
    let bannerActivity = false;
    if (bannerData) {
      bannerActivity = checkDateRangeStatus(
        bannerData.startDate,
        bannerData.endDate
      );
    }
    setBannerActive(bannerActivity);
  }, [bannerData]);

  const showBanner = !!bannerData?.key && bannerActive;
  const { intro, cards } = verbiage;

  // LaunchDarkly
  const wpReport = useFlags()?.wpReport;
  const sarReport = useFlags().sarReport;

  return (
    <>
      <Collapse in={showBanner}>
        <Banner bannerData={bannerData} />
      </Collapse>
      <PageTemplate sx={sx.layout} data-testid="home-view">
        {userIsEndUser ? (
          <>
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
            <TemplateCard
              templateName="WP"
              verbiage={cards.WP}
              cardprops={sx.card}
              isHidden={!wpReport}
            />
            <TemplateCard
              verbiage={cards.SAR}
              cardprops={sx.card}
              isHidden={!sarReport}
            />
          </>
        ) : (
          <AdminDashSelector verbiage={verbiage.readOnly} />
        )}
      </PageTemplate>
    </>
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
