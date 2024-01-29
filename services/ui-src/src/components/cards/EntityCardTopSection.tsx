// components
import { Heading, Text, Grid, GridItem, Flex, Box } from "@chakra-ui/react";
import { notAnsweredText } from "../../constants";
// utils
import { AnyObject, OverlayModalStepTypes, ReportType } from "types";
import { useStore } from "utils";

export const EntityStepCardTopSection = ({
  stepType,
  formattedEntityData,
}: Props) => {
  const { report } = useStore() ?? {};
  switch (stepType) {
    case OverlayModalStepTypes.OBJECTIVE_PROGRESS:
      return (
        <>
          <Heading sx={sx.mainHeading}>
            {formattedEntityData.objectiveName}
          </Heading>
          <Text sx={sx.subtitle}>
            Performance measure description or indicators your state will use to
            monitor progress towards achievement
          </Text>
          <Text sx={sx.description}>{formattedEntityData.description}</Text>
          <Text sx={sx.subtitle}>Performance measure targets</Text>
          <Text sx={sx.description}>{formattedEntityData.targets}</Text>
          {formattedEntityData?.performanceMeasureProgress && (
            <Box sx={sx.newContentContainer} marginBottom="1rem">
              <Text sx={sx.subtitleEmphasized}>
                Performance measure progress toward milestones and key
                deliverables for current reporting period
              </Text>
              <Text sx={sx.description}>
                {formattedEntityData?.performanceMeasureProgress}
              </Text>
            </Box>
          )}

          <Box
            sx={
              formattedEntityData?.quarterActuals?.length > 0
                ? sx.newContentContainer
                : undefined
            }
          >
            {formattedEntityData?.quarterProjections?.length > 0 ? (
              <>
                <Text sx={sx.subtitleEmphasized} data-testid="sar-grid">
                  Quantitative targets for this reporting period
                </Text>

                <Grid sx={sx.sarGrid}>
                  {formattedEntityData?.quarterProjections
                    .slice(0, 2)
                    .map((quarter: any) => {
                      return (
                        <GridItem key={quarter.id}>
                          <Flex sx={sx.gridItems}>
                            <Text sx={sx.sarGridSubtitle}>
                              {quarter.id} Target:
                            </Text>
                            <Text sx={sx.subtext}>{quarter.value}</Text>
                          </Flex>
                        </GridItem>
                      );
                    })}
                  {formattedEntityData?.quarterActuals
                    .slice(0, 2)
                    .map((quarter: any) => {
                      return (
                        <GridItem key={quarter.id}>
                          <Flex sx={sx.gridItems}>
                            <Text sx={sx.sarGridSubtitle}>
                              {quarter.id} Actual:
                            </Text>
                            <Text sx={sx.subtext}>{quarter.value}</Text>
                          </Flex>
                        </GridItem>
                      );
                    })}
                </Grid>
                {formattedEntityData?.targetsMet &&
                  wereTargetsMetForObjectiveProgress(formattedEntityData)}
              </>
            ) : (
              wereTargetsMetForObjectiveProgress(formattedEntityData)
            )}
          </Box>
        </>
      );
    case OverlayModalStepTypes.EVALUATION_PLAN:
      return (
        <>
          <Heading sx={sx.mainHeading}>
            {formattedEntityData.objectiveName}
          </Heading>
          <Text sx={sx.subtitle}>
            Performance measure description or indicators your state will use to
            monitor progress towards achievement
          </Text>
          <Text sx={sx.description}>{formattedEntityData.description}</Text>
          <Text sx={sx.subtitle}>Performance measure targets</Text>
          <Text sx={sx.description}>{formattedEntityData.targets}</Text>
          {report?.reportType === ReportType.WP && (
            <>
              <Text sx={sx.subtitle}>
                Does the performance measure include quantitative targets?
              </Text>
              <Text sx={sx.description}>
                {formattedEntityData?.includesTargets}
              </Text>
            </>
          )}
          {formattedEntityData.quarters?.length > 0 && (
            <>
              <Text sx={sx.subtitle}>Quantitative Targets</Text>
              <Grid sx={sx.grid}>
                {formattedEntityData?.quarters.map((quarter: any) => {
                  return (
                    <GridItem key={quarter.id}>
                      <Flex sx={sx.gridItems}>
                        <Text sx={sx.gridSubtitle}>{quarter.id}:</Text>
                        <Text
                          sx={
                            quarter.value === notAnsweredText
                              ? sx.error
                              : sx.subtext
                          }
                        >
                          {quarter.value}
                        </Text>
                      </Flex>
                    </GridItem>
                  );
                })}
              </Grid>
            </>
          )}
          <Text sx={sx.subtitle}>
            Additional detail on strategies/approaches the state or territory
            will use to achieve targets and/ or meet milestones
          </Text>
          <Text sx={sx.description}>
            {formattedEntityData.additionalDetails}
          </Text>
        </>
      );
    case OverlayModalStepTypes.FUNDING_SOURCES:
      return (
        <>
          <Heading sx={sx.mainHeading}>
            {formattedEntityData.fundingSource}
          </Heading>
          {formattedEntityData.quarters.length > 0 && (
            <>
              <Text sx={sx.subtitle}>Projected quarterly expenditures</Text>
              <Grid sx={sx.grid}>
                {formattedEntityData?.quarters?.map((quarter: any) => {
                  return (
                    <GridItem key={quarter.id}>
                      <Flex sx={sx.gridItems}>
                        <Text sx={sx.gridSubtitle}>{quarter.id}:</Text>
                        <Text
                          sx={
                            quarter.value === notAnsweredText
                              ? sx.error
                              : sx.subtext
                          }
                        >
                          {quarter.value}
                        </Text>
                      </Flex>
                    </GridItem>
                  );
                })}
              </Grid>
            </>
          )}
        </>
      );
    default:
      return <Text>{stepType}</Text>;
  }
};

interface Props {
  stepType: string;
  formattedEntityData: AnyObject;
  printVersion?: boolean;
}

const wereTargetsMetForObjectiveProgress = (formattedEntityData: AnyObject) => {
  return (
    <>
      {formattedEntityData?.targetsMet && (
        <Box
          sx={
            formattedEntityData?.quarterActuals?.length === 0
              ? sx.newContentContainer
              : undefined
          }
        >
          <Text sx={sx.subtitleEmphasized}>
            Were targets for performance measures and/or expected time frames
            for deliverables met?
          </Text>
          <Text sx={sx.description}>{formattedEntityData?.targetsMet}</Text>
          {formattedEntityData?.targetsMet === "No" && (
            <>
              <Text sx={sx.subtitleEmphasized}>
                Describe progress toward reaching the target/milestone during
                the reporting period. How close are you to meeting the target?
                How do you plan to address any obstacle(s) to meeting the
                target?
              </Text>
              <Text sx={sx.description}>
                {formattedEntityData?.missedTargetReason}
              </Text>
            </>
          )}
        </Box>
      )}
    </>
  );
};

const sx = {
  mainHeading: {
    fontSize: "md",
  },
  heading: {
    fontSize: "sm",
  },
  description: {
    marginTop: "0.25rem",
    marginBottom: "1rem",
    fontSize: "sm",
  },
  newContentContainer: {
    backgroundColor: "#EEFBFF",
    padding: ".25rem 1.5rem",
  },
  grid: {
    display: "grid",
    gridTemplateRows: "1fr 1fr 1fr 1fr",
    gridAutoFlow: "column",
    gridGap: ".5rem",
    marginBottom: "1.25rem",
  },
  sarGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridAutoFlow: "row",
    marginBottom: "1.25rem",
    width: "50%",
  },
  gridSubtitle: {
    fontWeight: "bold",
    fontSize: "sm",
    marginRight: ".25rem",
  },
  sarGridSubtitle: {
    fontWeight: "bold",
    fontSize: "xs",
    marginRight: ".25rem",
  },
  subtitle: {
    marginTop: "1rem",
    fontSize: "xs",
    fontWeight: "bold",
  },
  subtitleEmphasized: {
    marginTop: "1rem",
    fontSize: "sm",
    fontWeight: "bold",
  },
  subtext: {
    marginTop: "0.25rem",
    fontSize: "sm",
  },
  error: {
    fontSize: "sm",
    color: "palette.error_dark",
  },
  gridItems: {
    alignItems: "end",
    flexWrap: "wrap",
    ".subtitle": {
      marginRight: ".5rem",
    },
  },
};
