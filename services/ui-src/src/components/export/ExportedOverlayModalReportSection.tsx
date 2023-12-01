// components
import { Box, Heading, Text } from "@chakra-ui/react";
// utils
import { getFormattedEntityData, useStore } from "utils";
import { EntityShape, OverlayModalPageShape } from "types";
import { EntityStepCard } from "components/cards/EntityStepCard";
import exportVerbiage from "verbiage/pages/wp/wp-export";

export const ExportedOverlayModalReportSection = ({
  route,
  section: { entityType, verbiage },
}: Props) => {
  const { report } = useStore() ?? {};
  const { stepType } = route;
  const entities = report?.fieldData?.[entityType];
  const entityCount = entities?.length;
  const { emptyEntityMessage } = exportVerbiage;

  return (
    <Box mt="2rem" data-testid="exportedOverlayModalPage" sx={sx.container}>
      <Heading as="h2" sx={sx.dashboardTitle} data-testid="headerCount">
        {`${verbiage.dashboardTitle} ${entityCount > 0 ? entityCount : ""}`}
        {!entityCount && (
          <Text as="span" sx={sx.notAnswered} data-testid="entityMessage">
            {emptyEntityMessage[entityType as keyof typeof emptyEntityMessage]}
          </Text>
        )}{" "}
      </Heading>
      {entities?.map((entity: EntityShape, entityIndex: number) => (
        <EntityStepCard
          key={entity.id}
          entity={entity}
          entityType={entityType}
          entityIndex={entityIndex}
          formattedEntityData={getFormattedEntityData(entityType, entity)}
          verbiage={verbiage}
          stepType={stepType}
          printVersion
        />
      ))}
    </Box>
  );
};

export interface Props {
  section: OverlayModalPageShape;
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
    marginBottom: "1.25rem",
    fontSize: "md",
    fontWeight: "bold",
    color: "palette.gray_medium",
  },
  // TODO: delete this
  border: {
    border: "10px solid black",
  },
};
