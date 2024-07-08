// components
import { Heading, Text, Grid, GridItem, Flex } from "@chakra-ui/react";
import { notAnsweredText } from "../../constants";
// utils
import { AnyObject, HeadingLevel } from "types";

export const FundingSourcesEntity = ({
  formattedEntityData,
  headingLevel = "h2",
}: Props) => {
  return (
    <>
      <Heading as={headingLevel} sx={sx.mainHeading}>
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
  grid: {
    display: "grid",
    gridTemplateRows: "1fr 1fr 1fr 1fr",
    gridAutoFlow: "column",
    gridGap: ".5rem",
    marginBottom: "1.25rem",
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
