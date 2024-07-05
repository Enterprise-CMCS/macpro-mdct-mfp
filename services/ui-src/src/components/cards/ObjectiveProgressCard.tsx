// components
import { Heading, Text, Grid, GridItem, Flex } from "@chakra-ui/react";
// utils
import { AnyObject, HeadingLevel } from "types";
import { ObjectiveProgressCardBottomSection } from "./ObjectiveProgressCardBottomSection";

export const ObjectiveProgressCard = ({
  formattedEntityData,
  entityCompleted,
  headingLevel = "h2",
  verbiage,
  entity,
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
      {formattedEntityData.quarterProjections.length > 0 && !entityCompleted && (
        <>
          <Text sx={sx.subtitle}>
            Quantitative targets for this reporting period
          </Text>
          <Grid sx={sx.sarGrid}>
            {formattedEntityData?.quarterProjections.map((quarter: any) => {
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
        <ObjectiveProgressCardBottomSection
          verbiage={verbiage}
          entity={entity}
          formattedEntityData={{
            ...formattedEntityData,
            isPartiallyComplete: !entityCompleted,
          }}
        />
      ) : (
        <Text sx={sx.unfinishedMessage}></Text>
      )}
    </>
  );
};

interface Props {
  formattedEntityData: AnyObject;
  entityCompleted?: boolean;
  headingLevel?: HeadingLevel;
  verbiage: AnyObject;
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
    marginTop: "0.25rem",
    marginBottom: "1rem",
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
  unfinishedMessage: {
    marginY: "1rem",
    fontSize: "xs",
    color: "palette.error_dark",
  },
};
