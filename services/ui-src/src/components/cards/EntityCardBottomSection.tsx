// utils
import { AnyObject, ReportType } from "types";
import { Text, Box, Grid, GridItem, Flex } from "@chakra-ui/react";

import { useStore } from "utils";
import { notAnsweredText } from "../../constants";

const wereTargetsMetForObjectiveProgress = (
  formattedEntityData: AnyObject,
  printVersion?: boolean
) => {
  return (
    <>
      {(formattedEntityData?.targetsMet || printVersion) && (
        <Box
          sx={
            formattedEntityData?.quarterActuals?.length === 0
              ? formattedEntityData?.targetsMet
                ? sx.box
                : sx.notAnsweredBox
              : undefined
          }
        >
          <Text sx={sx.subtitle}>
            Were targets for performance measures and/or expected time frames
            for deliverables met?
          </Text>
          <Text sx={sx.description}>{formattedEntityData?.targetsMet}</Text>
          {!formattedEntityData?.targetsMet && (
            <Text sx={{ ...sx.notAnsweredDescription, marginTop: "-1rem" }}>
              {notAnsweredText}{" "}
            </Text>
          )}
          {(formattedEntityData?.targetsMet === "No" ||
            (printVersion && !formattedEntityData?.targetsMet)) && (
            <>
              <Text sx={sx.subtitle}>
                Describe progress toward reaching the target/milestone during
                the reporting period. How close are you to meeting the target?
                How do you plan to address any obstacle(s) to meeting the
                target?
              </Text>
              <Text
                sx={
                  formattedEntityData?.missedTargetReason
                    ? sx.description
                    : sx.notAnsweredDescription
                }
              >
                {formattedEntityData?.missedTargetReason ?? notAnsweredText}
              </Text>
            </>
          )}
        </Box>
      )}
    </>
  );
};

export const EntityStepCardBottomSection = ({
  stepType,
  formattedEntityData,
  printVersion,
}: Props) => {
  const { report } = useStore() ?? {};
  switch (stepType) {
    case "objectiveProgress":
      if (report?.reportType === ReportType.SAR) {
        return (
          <>
            {(formattedEntityData?.performanceMeasureProgress ||
              printVersion) && (
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
              {formattedEntityData?.quarterProjections?.length > 0 ? (
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
                  {(formattedEntityData?.targetsMet || printVersion) &&
                    wereTargetsMetForObjectiveProgress(
                      formattedEntityData,
                      printVersion
                    )}
                </>
              ) : (
                wereTargetsMetForObjectiveProgress(
                  formattedEntityData,
                  printVersion
                )
              )}
            </Box>
          </>
        );
      } else {
        return <></>;
      }
    default:
      return <></>;
  }
};

interface Props {
  stepType: string;
  formattedEntityData: AnyObject;
  printVersion?: boolean;
  entity?: AnyObject;
  verbiage?: {
    entityMissingResponseMessage?: string;
    entityEmptyResponseMessage?: string;
  };
}

const sx = {
  box: {
    backgroundColor: "#EEFBFF",
    padding: "0.5rem 1rem",
    marginBottom: "1rem",
  },
  description: {
    marginTop: "0.25rem",
    marginBottom: "1.25rem",
    fontSize: "sm",
  },
  subtitle: {
    marginTop: "1rem",
    fontSize: "xs",
    fontWeight: "bold",
  },
  notAnsweredBox: {
    backgroundColor: "#FCE8EC",
    padding: "0.5rem 1rem",
    marginBottom: "1rem",
  },
  notAnsweredDescription: {
    marginTop: "0.25rem",
    marginBottom: "1.25rem",
    fontSize: "sm",
    color: "palette.error_darker",
  },
  sarGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridAutoFlow: "row",
    marginBottom: "1.25rem",
    width: "50%",
  },
  gridItems: {
    alignItems: "end",
    flexWrap: "wrap",
    ".subtitle": {
      marginRight: ".5rem",
    },
    fontSize: "sm",
  },
  sarGridSubtitle: {
    fontWeight: "bold",
    fontSize: "xs",
    marginRight: ".25rem",
  },
};
