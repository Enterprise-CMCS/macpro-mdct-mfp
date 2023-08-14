import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  useDisclosure,
} from "@chakra-ui/react";

import {
  DrawerReportPageShape,
  EntityShape,
  FormField,
  isFieldElement,
} from "types";

import { ReportDrawer } from "components/drawers/ReportDrawer";
import { ReportPageIntro } from "./ReportPageIntro";
import { parseCustomHtml } from "utils";
import completedIcon from "assets/icons/icon_check_circle.png";

export const DrawerReportPage = ({ route, validateOnRender }: Props) => {
  const submitting = false;
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { verbiage, drawerForm } = route;
  const [selectedEntity, setSelectedEntity] = useState<EntityShape | undefined>(
    undefined
  );

  const entities = [
    {
      id: "123",
      name: "mock-entity",
    },
  ];

  // hardcoded state just to give the drawer page an entity so you can see the drawer
  const openRowDrawer = () => {
    setSelectedEntity({
      id: "123",
      name: "mock entity",
    });
    onOpen();
  };

  const entityRows = (entities: EntityShape[]) => {
    return entities.map((entity) => {
      /*
       * If the entity has the same fields from drawerForms fields, it was completed
       * at somepoint.
       */
      const isEntityCompleted = drawerForm.fields
        ?.filter(isFieldElement)
        .every((field: FormField) => field.id in entity);
      return (
        <Flex key={entity.id} sx={sx.entityRow}>
          {isEntityCompleted && (
            <Image
              src={completedIcon}
              alt={"Entity is complete"}
              sx={sx.statusIcon}
            />
          )}
          <Heading as="h4" sx={sx.entityName}>
            {entity.name}
          </Heading>
          <Button
            sx={sx.enterButton}
            onClick={() => openRowDrawer()}
            variant="outline"
          >
            {isEntityCompleted ? "Edit" : "Enter"}
          </Button>
        </Flex>
      );
    });
  };

  return (
    <Box>
      {verbiage.intro && <ReportPageIntro text={verbiage.intro} />}
      <Heading as="h3" sx={sx.dashboardTitle}>
        {verbiage.dashboardTitle}
      </Heading>
      <Box>
        {entities?.length ? (
          entityRows(entities)
        ) : (
          <Box sx={sx.missingEntityMessage}>
            {parseCustomHtml(verbiage.missingEntityMessage || "")}
          </Box>
        )}
      </Box>
      <ReportDrawer
        selectedEntity={selectedEntity!}
        verbiage={{
          drawerTitle: `${verbiage.drawerTitle} ${selectedEntity?.name}`,
          drawerInfo: verbiage.drawerInfo,
        }}
        form={drawerForm}
        onSubmit={() => {}}
        submitting={submitting}
        drawerDisclosure={{
          isOpen,
          onClose,
        }}
        validateOnRender={validateOnRender}
        data-testid="report-drawer"
      />
    </Box>
  );
};

interface Props {
  route: DrawerReportPageShape;
  validateOnRender?: boolean;
}

const sx = {
  statusIcon: {
    height: "1.25rem",
    position: "absolute",
  },
  dashboardTitle: {
    paddingBottom: "0.75rem",
    borderBottom: "1.5px solid var(--chakra-colors-palette-gray_lighter)",
    color: "palette.gray_medium",
    fontSize: "lg",
    fontWeight: "bold",
  },
  entityRow: {
    justifyContent: "space-between",
    alignItems: "center",
    height: "3.25rem",
    padding: "0.5rem",
    paddingLeft: "0.75rem",
    borderBottom: "1.5px solid var(--chakra-colors-palette-gray_lighter)",
  },
  entityName: {
    fontSize: "lg",
    fontWeight: "bold",
    flexGrow: 1,
    marginLeft: "2.25rem",
  },
  missingEntityMessage: {
    paddingTop: "1rem",
    fontWeight: "bold",
    a: {
      color: "palette.primary",
      textDecoration: "underline",
      "&:hover": {
        color: "palette.primary_darker",
      },
    },
  },
  enterButton: {
    width: "4.25rem",
    height: "1.75rem",
    fontSize: "md",
    fontWeight: "normal",
  },
};
