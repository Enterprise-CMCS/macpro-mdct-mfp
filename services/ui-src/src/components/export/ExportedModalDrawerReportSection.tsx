// components
import { Box, Heading, Text } from "@chakra-ui/react";
import { EntityStepCard } from "components";
// utils
import { getFormattedEntityData, useStore } from "utils";
import { EntityShape, ModalDrawerReportPageShape } from "types";
// verbiage
import exportVerbiage from "verbiage/pages/wp/wp-export";

export const ExportedModalDrawerReportSection = ({
  section: { entityType, verbiage },
}: Props) => {
  const { report } = useStore() ?? {};
  const { emptyEntityMessage } = exportVerbiage;
  const entities = report?.fieldData?.[entityType];
  const entityCount = entities?.length;

  return (
    <Box
      mt="2rem"
      data-testid="exportedModalDrawerReportSection"
      sx={sx.container}
    >
      <Heading as="h3" sx={sx.dashboardTitle} data-testid="headerCount">
        {`${verbiage.dashboardTitle} ${entityCount > 0 ? entityCount : ""}`}
        {!entityCount && (
          <Text as="span" sx={sx.notAnswered} data-testid="entityMessage">
            {emptyEntityMessage[entityType as keyof typeof emptyEntityMessage]}
          </Text>
        )}
      </Heading>
      {entities?.map((entity: EntityShape, entityIndex: number) => (
        <EntityStepCard
          key={entity.id}
          entity={entity}
          entityIndex={entityIndex}
          stepType={entityType}
          verbiage={verbiage}
          formattedEntityData={getFormattedEntityData(entityType, entity)}
        />
      ))}
    </Box>
  );
};

export interface Props {
  section: ModalDrawerReportPageShape;
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
};
