import { useState } from "react";
// components
import { Box, Button, Heading, useDisclosure } from "@chakra-ui/react";
import {
  AddEditEntityModal,
  DeleteEntityModal,
  ReportPageFooter,
  ReportPageIntro,
} from "components";

// types
import { EntityShape, EntityType, ModalDrawerReportPageShape } from "types";
import { EntityCard } from "components/cards/EntityCard";
import { ReportDrawer } from "components/drawers/ReportDrawer";
import { getFormattedEntityData } from "utils/reports/entities";

export const ModalDrawerReportPage = ({ route, validateOnRender }: Props) => {
  const { entityType, verbiage, modalForm, drawerForm: drawerFormJson } = route;

  const submitting = false;
  const [selectedEntity, setSelectedEntity] = useState<EntityShape | undefined>(
    undefined
  );

  const entities = [
    {
      id: "123",
      name: "mock-entity",
    },
  ];

  // create drawerForm from json
  const drawerForm = { ...drawerFormJson };

  // add/edit entity modal disclosure and methods
  const {
    isOpen: addEditEntityModalIsOpen,
    onOpen: addEditEntityModalOnOpenHandler,
    onClose: addEditEntityModalOnCloseHandler,
  } = useDisclosure();

  const openAddEditEntityModal = (entity?: EntityShape) => {
    if (entity) setSelectedEntity(entity);
    addEditEntityModalOnOpenHandler();
  };

  const closeAddEditEntityModal = () => {
    setSelectedEntity(undefined);
    addEditEntityModalOnCloseHandler();
  };

  // delete modal disclosure and methods
  const {
    isOpen: deleteEntityModalIsOpen,
    onOpen: deleteEntityModalOnOpenHandler,
    onClose: deleteEntityModalOnCloseHandler,
  } = useDisclosure();

  const openDeleteEntityModal = () => {
    setSelectedEntity({
      id: "123",
      name: "mock entity",
    });
    deleteEntityModalOnOpenHandler();
  };

  const closeDeleteEntityModal = () => {
    setSelectedEntity(undefined);
    deleteEntityModalOnCloseHandler();
  };

  // report drawer disclosure and methods
  const {
    isOpen: drawerIsOpen,
    onOpen: drawerOnOpenHandler,
    onClose: drawerOnCloseHandler,
  } = useDisclosure();

  const openDrawer = (entity: EntityShape) => {
    setSelectedEntity(entity);
    drawerOnOpenHandler();
  };

  const closeDrawer = () => {
    setSelectedEntity(undefined);
    drawerOnCloseHandler();
  };

  const dashTitle = `${verbiage.dashboardTitle}${
    verbiage.countEntitiesInTitle ? ` ${entities.length}` : ""
  }`;

  return (
    <Box>
      {verbiage.intro && <ReportPageIntro text={verbiage.intro} />}
      <Box>
        <Button
          sx={sx.topAddEntityButton}
          onClick={addEditEntityModalOnOpenHandler}
        >
          {verbiage.addEntityButtonText}
        </Button>
        {entities.length !== 0 && (
          <Heading as="h3" sx={sx.dashboardTitle}>
            {dashTitle}
          </Heading>
        )}
        {entities.map((entity: EntityShape, entityIndex: number) => (
          <EntityCard
            key={entity.id}
            entity={entity}
            entityIndex={entityIndex}
            entityType={entityType}
            verbiage={verbiage}
            formattedEntityData={getFormattedEntityData()}
            openAddEditEntityModal={openAddEditEntityModal}
            openDeleteEntityModal={openDeleteEntityModal}
            openDrawer={openDrawer}
          />
        ))}
        <AddEditEntityModal
          selectedEntity={selectedEntity}
          verbiage={verbiage}
          form={modalForm}
          modalDisclosure={{
            isOpen: addEditEntityModalIsOpen,
            onClose: closeAddEditEntityModal,
          }}
        />
        <DeleteEntityModal
          selectedEntity={selectedEntity}
          verbiage={verbiage}
          modalDisclosure={{
            isOpen: deleteEntityModalIsOpen,
            onClose: closeDeleteEntityModal,
          }}
        />
        <ReportDrawer
          entityType={entityType as EntityType}
          selectedEntity={selectedEntity!}
          verbiage={{
            ...verbiage,
            drawerDetails: getFormattedEntityData(),
          }}
          form={drawerForm}
          onSubmit={() => {}}
          submitting={submitting}
          drawerDisclosure={{
            isOpen: drawerIsOpen,
            onClose: closeDrawer,
          }}
          validateOnRender={validateOnRender}
          data-testid="report-drawer"
        />
        {entities.length > 1 && (
          <Button
            sx={sx.bottomAddEntityButton}
            onClick={addEditEntityModalOnOpenHandler}
          >
            {verbiage.addEntityButtonText}
          </Button>
        )}
      </Box>
      <ReportPageFooter />
    </Box>
  );
};

interface Props {
  route: ModalDrawerReportPageShape;
  validateOnRender?: boolean;
}

const sx = {
  dashboardTitle: {
    marginBottom: "1.25rem",
    fontSize: "md",
    fontWeight: "bold",
    color: "palette.gray_medium",
  },
  topAddEntityButton: {
    marginTop: "1.5rem",
    marginBottom: "2rem",
  },
  bottomAddEntityButton: {
    marginTop: "2rem",
    marginBottom: "0",
  },
};
