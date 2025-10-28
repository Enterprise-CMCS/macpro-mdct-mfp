// components
import { Heading, Text, Grid, GridItem, Flex } from "@chakra-ui/react";
import { notAnsweredText } from "../../constants";
// utils
import { AnyObject, HeadingLevel, ReportType } from "types";
import { useStore } from "utils";

export const EvaluationPlanEntity = ({
  formattedEntityData,
  headingLevel,
}: Props) => {
  const { report } = useStore();

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
      {report?.reportType === ReportType.WP && (
        <>
          <Text sx={sx.subtitle}>
            Does the performance measure include quantitative targets?
          </Text>
          <Text sx={sx.description}>{formattedEntityData.includesTargets}</Text>
        </>
      )}
      {formattedEntityData.quarters?.length > 0 && (
        <>
          <Text sx={sx.subtitle}>Quantitative Targets</Text>
          <Grid sx={sx.grid}>
            {formattedEntityData.quarters.map((quarter: any) => {
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
        Additional detail on strategies/approaches the state or territory will
        use to achieve targets and/ or meet milestones
      </Text>
      <Text sx={sx.description}>{formattedEntityData.additionalDetails}</Text>
    </>
  );
};

interface Props {
  formattedEntityData: AnyObject;
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
  unfinishedMessage: {
    marginY: "spacer2",
    fontSize: "xs",
    color: "error_dark",
  },
};
