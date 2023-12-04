// components
import { Box, Heading, Text } from "@chakra-ui/react";
// utils
import { getFormattedEntityData } from "utils";
import {
  EntityShape,
  FormField,
  FormLayoutElement,
  OverlayModalPageShape,
  OverlayModalStepTypes,
} from "types";
import { EntityStepCard } from "components";
// verbiage
import exportVerbiage from "verbiage/pages/wp/wp-export";

export const ExportedOverlayModalReportSection = ({
  section: { entityType, verbiage },
  entity,
  entityStep,
}: Props) => {
  const { emptyEntityMessage, dashboardTitle } = exportVerbiage;

  const stepType = entityStep![0] as string;
  const entityCount = entity?.[stepType]?.length;
  const noDataText =
    stepType === OverlayModalStepTypes.EVALUATION_PLAN
      ? "objectives"
      : "funding sources";

  return (
    <Box mt="2rem" data-testid="exportedOverlayModalPage" sx={sx.container}>
      <Heading as="h4">
        <Box sx={sx.stepName}>{entityStep![1]}</Box>
        <Box sx={sx.stepHint}>{entityStep![2]}</Box>
        <Box sx={sx.dashboardTitle} data-testid="headerCount">
          {`${
            dashboardTitle[
              stepType === OverlayModalStepTypes.EVALUATION_PLAN
                ? "objectives"
                : "fundingSources"
            ]
          } ${entityCount > 0 ? entityCount : `0 - no ${noDataText} added`}`}
          <Text as="span" sx={sx.notAnswered} data-testid="entityMessage">
            {emptyEntityMessage[entityType as keyof typeof emptyEntityMessage]}
          </Text>
        </Box>
      </Heading>
      {entity?.[stepType]?.map((step: any, index: number) => {
        return (
          <EntityStepCard
            key={entity.id}
            entity={entity}
            entityType={stepType}
            entityIndex={index}
            formattedEntityData={getFormattedEntityData(stepType, step)}
            verbiage={verbiage}
            stepType={stepType!}
            printVersion
          />
        );
      })}
    </Box>
  );
};

export interface Props {
  section: OverlayModalPageShape;
  entity?: EntityShape;
  entityStep?: (string | FormLayoutElement | FormField)[];
}

const sx = {
  container: {
    "@media print": {
      pageBreakInside: "avoid",
    },
  },
  notAnswered: {
    display: "block",
    fontSize: "md",
    fontWeight: "bold",
    color: "palette.error_darker",
    marginTop: "0.5rem",
  },
  dashboardTitle: {
    margin: "1rem auto 1.25rem",
    fontSize: "md",
    fontWeight: "bold",
    color: "palette.gray_medium",
  },
  stepName: {
    fontSize: "18px",
    paddingBottom: "0.75rem",
  },
  stepHint: {
    fontSize: "16px",
    fontWeight: "normal",
    color: "#5B616B",
  },
  // TODO: delete this
  border: {
    border: "10px solid black",
  },
};
