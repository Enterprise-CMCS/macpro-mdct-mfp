// components
import { Heading, Text, Grid, GridItem, Flex } from "@chakra-ui/react";
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
          {formattedEntityData.quarters.length > 0 &&
            (report?.reportType === ReportType.WP ? (
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
            ) : (
              <>
                <Text sx={sx.subtitle} data-testid="sar-grid">
                  Quantitative targets for this reporting period
                </Text>
                <Grid sx={sx.sarGrid}>
                  {formattedEntityData?.quarters
                    .slice(0, 2)
                    .map((quarter: any) => {
                      return (
                        <GridItem key={quarter.id}>
                          <Flex sx={sx.gridItems}>
                            <Text sx={sx.gridSubtitle}>
                              {quarter.id} Target:
                            </Text>
                            <Text sx={sx.subtext}>{quarter.value}</Text>
                          </Flex>
                        </GridItem>
                      );
                    })}
                </Grid>
              </>
            ))}
          {report?.reportType === ReportType.WP && (
            <>
              <Text sx={sx.subtitle}>
                Additional detail on strategies/approaches the state or
                territory will use to achieve targets and/ or meet milestones
              </Text>
              <Text sx={sx.description}>
                {formattedEntityData.additionalDetails}
              </Text>{" "}
            </>
          )}
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

const sx = {
  mainHeading: {
    fontSize: "md",
  },
  heading: {
    fontSize: "sm",
  },
  description: {
    marginTop: "0.25rem",
    marginBottom: "1.25rem",
    fontSize: "sm",
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
    gridTemplateRows: "1fr",
    gridAutoFlow: "column",
    marginBottom: "1.25rem",
    width: "50%",
  },
  gridSubtitle: {
    fontWeight: "bold",
    fontSize: "sm",
    marginRight: ".25rem",
  },
  subtitle: {
    marginTop: "1rem",
    fontSize: "xs",
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
