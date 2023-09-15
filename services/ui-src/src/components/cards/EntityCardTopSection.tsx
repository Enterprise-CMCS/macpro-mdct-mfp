// components
import { Heading, Text, Grid, GridItem, Flex } from "@chakra-ui/react";
// utils
import { AnyObject, OverlayModalEntityTypes } from "types";

export const EntityCardTopSection = ({
  entityType,
  formattedEntityData,
}: Props) => {
  switch (entityType) {
    case OverlayModalEntityTypes.EVALUATION_PLAN:
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
          <Text sx={sx.description}>{formattedEntityData.includesTargets}</Text>
          <Text sx={sx.subtitle}>
            Additional detail on strategies/approaches the state or territory
            will use to achieve targets and/ or meet milestones
          </Text>
          <Text sx={sx.description}>
            {formattedEntityData.additionalDetails}
          </Text>{" "}
        </>
      );
    case OverlayModalEntityTypes.FUNDING_SOURCES:
      return (
        <>
          <Heading as="h3" sx={sx.heading}>
            {formattedEntityData.objectiveName}
          </Heading>
          <Text sx={sx.subtitle}>Projected quarterly expenditures</Text>
          <Grid sx={sx.grid}>
            {formattedEntityData.quarters.map((quarter: any) => {
              return (
                <GridItem>
                  <Flex sx={sx.gridItems}>
                    <Text sx={sx.subtitleGrid}>{quarter.id}:</Text>
                    <Text sx={sx.subtext}>{quarter.value}</Text>
                  </Flex>
                </GridItem>
              );
            })}
          </Grid>
        </>
      );
    default:
      return <Text>{entityType}</Text>;
  }
};

interface Props {
  entityType: string;
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
    gridTemplateColumns: "repeat(3,minmax(0px,1fr))",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    display: "grid",
  },
  subtitleGrid: {
    marginTop: ".5rem",
    gridTemplateColumns: "33% auto",
    columnGap: "1rem",
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
  gridItems: {
    alignItems: "end",
    flexWrap: "wrap",
    ".subtitle": {
      marginRight: ".5rem",
    },
  },
};
