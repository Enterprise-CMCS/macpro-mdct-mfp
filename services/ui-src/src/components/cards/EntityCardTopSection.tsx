// components
import { Heading, Text, Grid, GridItem, Flex } from "@chakra-ui/react";
import { notAnsweredText } from "../../constants";
// utils
import { AnyObject, OverlayModalStepTypes } from "types";

export const EntityStepCardTopSection = ({
  stepType,
  formattedEntityData,
}: Props) => {
  switch (stepType) {
    case OverlayModalStepTypes.EVALUATION_PLAN:
      return (
        <>
          <Heading as="h4" sx={sx.heading}>
            {formattedEntityData.objectiveName}
          </Heading>
          <Text sx={sx.subtitle}>
            Performance measure description or indicators your state will use to
            monitor progress towards achievement
          </Text>
          <Text sx={sx.description}>{formattedEntityData.description}</Text>
          <Text sx={sx.subtitle}>Performance measure targets</Text>
          <Text sx={sx.description}>{formattedEntityData.targets}</Text>
          <Text sx={sx.subtitle}>
            Does the performance measure include quantitative targets?
          </Text>
          <Text sx={sx.description}>
            {formattedEntityData?.includesTargets}
          </Text>
          {formattedEntityData.quarters.length > 0 && (
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
          </Text>{" "}
        </>
      );
    case OverlayModalStepTypes.FUNDING_SOURCES:
      return (
        <>
          <Heading as="h3" sx={sx.heading}>
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
  heading: {
    fontSize: "sm",
  },
  description: {
    marginTop: "0.75rem",
    fontSize: "sm",
  },
  grid: {
    display: "grid",
    gridTemplateRows: "1fr 1fr 1fr 1fr",
    gridAutoFlow: "column",
    gridGap: ".5rem",
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
