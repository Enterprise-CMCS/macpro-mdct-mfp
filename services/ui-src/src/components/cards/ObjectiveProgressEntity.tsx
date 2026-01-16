// components
import { Heading, Text, Grid, GridItem, Flex, Box } from "@chakra-ui/react";
// utils
import { AnyObject, HeadingLevel } from "types";
// constants
import { notAnsweredText } from "../../constants";

const wereTargetsMetForObjectiveProgress = (formattedEntityData: AnyObject) => {
  return (
    <>
      {formattedEntityData.targetsMet && (
        <Box
          sx={
            formattedEntityData.quarterActuals?.length === 0
              ? formattedEntityData.targetsMet
                ? sx.box
                : sx.notAnsweredBox
              : undefined
          }
        >
          <Text sx={sx.subtitle}>
            Were targets for performance measures and/or expected time frames
            for deliverables met?
          </Text>
          <Text sx={sx.description}>{formattedEntityData.targetsMet}</Text>
          {!formattedEntityData.targetsMet && (
            <Text sx={{ ...sx.notAnsweredDescription, marginTop: "-1rem" }}>
              {notAnsweredText}{" "}
            </Text>
          )}
          {(formattedEntityData.targetsMet === "No" ||
            !formattedEntityData.targetsMet) && (
            <>
              <Text sx={sx.subtitle}>
                Describe progress toward reaching the target/milestone during
                the reporting period. How close are you to meeting the target?
                How do you plan to address any obstacle(s) to meeting the
                target?
              </Text>
              <Text
                sx={
                  formattedEntityData.missedTargetReason
                    ? sx.description
                    : sx.notAnsweredDescription
                }
              >
                {formattedEntityData.missedTargetReason ?? notAnsweredText}
              </Text>
            </>
          )}
        </Box>
      )}
    </>
  );
};

export const ObjectiveProgressEntity = ({
  formattedEntityData,
  entityCompleted,
  headingLevel,
}: Props) => {
  return (
    <>
      <Heading as={headingLevel} sx={sx.mainHeading}>
        {formattedEntityData.objectiveName}
      </Heading>
      <Text sx={sx.subtitle}>
        Performance measure description or indicators your state or territory
        will use to monitor progress towards achievement
      </Text>
      <Text sx={sx.description}>{formattedEntityData.description}</Text>
      <Text sx={sx.subtitle}>Performance measure targets</Text>
      <Text sx={sx.description}>{formattedEntityData.targets}</Text>
      {formattedEntityData.quarterProjections.length > 0 &&
        !entityCompleted && (
          <>
            <Text sx={sx.subtitle}>
              Quantitative targets for this reporting period
            </Text>
            <Grid sx={sx.sarGrid}>
              {formattedEntityData.quarterProjections.map((quarter: any) => {
                return (
                  <GridItem key={quarter.id}>
                    <Flex sx={sx.gridItems}>
                      <Text sx={sx.gridSubtitle}>{quarter.id} Target:</Text>
                      <Text sx={sx.subtext}>{quarter.value}</Text>
                    </Flex>
                  </GridItem>
                );
              })}
            </Grid>
          </>
        )}
      {entityCompleted ? (
        <>
          {formattedEntityData?.performanceMeasureProgress && (
            <Box
              sx={
                formattedEntityData?.performanceMeasureProgress
                  ? sx.box
                  : sx.notAnsweredBox
              }
            >
              <Text sx={sx.subtitle}>
                Performance measure progress toward milestones and key
                deliverables for current reporting period
              </Text>
              <Text
                sx={
                  formattedEntityData?.performanceMeasureProgress
                    ? sx.description
                    : sx.notAnsweredDescription
                }
              >
                {formattedEntityData?.performanceMeasureProgress ??
                  notAnsweredText}
              </Text>
            </Box>
          )}

          <Box
            sx={
              formattedEntityData?.quarterActuals?.length > 0
                ? sx.box
                : undefined
            }
          >
            {formattedEntityData?.targetsMet &&
            formattedEntityData?.quarterProjections?.length > 0 ? (
              <>
                <Text sx={sx.subtitle} data-testid="sar-grid">
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
                            <Text sx={sx.gridItems}>{quarter.value}</Text>
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
                            <Text sx={sx.gridItems}>{quarter.value}</Text>
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
      ) : (
        <></>
      )}
    </>
  );
};

interface Props {
  formattedEntityData: AnyObject;
  entityCompleted?: boolean;
  headingLevel?: HeadingLevel;
  entity?: AnyObject;
}

const sx = {
  mainHeading: {
    fontSize: "md",
  },
  heading: {
    fontSize: "sm",
  },
  description: {
    marginTop: "spacer_half",
    marginBottom: "spacer2",
    fontSize: "sm",
  },
  grid: {
    display: "grid",
    gridTemplateRows: "1fr 1fr 1fr 1fr",
    gridAutoFlow: "column",
    gridGap: "spacer1",
    marginBottom: "1.25rem",
  },
  sarGrid: {
    display: "grid",
    gridTemplateRows: "1fr",
    gridAutoFlow: "column",
    marginBottom: "1.25rem",
    width: "50%",
  },
  sarGridSubtitle: {
    fontWeight: "bold",
    fontSize: "xs",
    marginRight: "spacer_half",
  },
  gridSubtitle: {
    fontWeight: "bold",
    fontSize: "sm",
    marginRight: "spacer_half",
  },
  subtitle: {
    marginTop: "spacer2",
    fontSize: "xs",
    fontWeight: "bold",
  },
  subtext: {
    marginTop: "spacer_half",
    fontSize: "sm",
  },
  error: {
    fontSize: "sm",
    color: "error_dark",
  },
  gridItems: {
    alignItems: "end",
    flexWrap: "wrap",
    ".subtitle": {
      marginRight: "spacer1",
    },
  },
  box: {
    backgroundColor: "#EEFBFF",
    padding: "0.5rem 1rem",
    marginBottom: "spacer2",
  },
  notAnsweredBox: {
    backgroundColor: "#FCE8EC",
    padding: "0.5rem 1rem",
    marginBottom: "spacer2",
  },
  notAnsweredDescription: {
    marginTop: "spacer_half",
    marginBottom: "1.25rem",
    fontSize: "sm",
    color: "error_darker",
  },
};
