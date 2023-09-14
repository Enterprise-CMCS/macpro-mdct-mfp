import { useState } from "react";
// components
import { Box, Button, Heading, Image, useDisclosure } from "@chakra-ui/react";
import {
  AddEditEntityModal,
  DeleteEntityModal,
  InstructionsAccordion,
  ReportPageFooter,
  ReportPageIntro,
} from "components";
// assets
import addIcon from "assets/icons/icon_add.png";
// types
import { EntityShape, OverlayModalPageShape } from "types";
import { AnyObject } from "yup/lib/types";
import { EntityCard } from "components/cards/EntityCard";
import { getFormattedEntityData } from "utils/reports/entities";
import { useStore } from "utils";
// utils

export const OverlayModalPage = ({ accordion, route }: Props) => {
  const { entityType, verbiage, modalForm } = route;
  const { report } = useStore();
  const [selectedEntity, setSelectedEntity] = useState<EntityShape | undefined>(
    undefined
  );

  //display variables
  let reportFieldDataEntities = report?.fieldData[entityType] || [];

  ///TEMPORARY ENTITY//
  let tempEntity: EntityShape = {
    id: "mockid",
    fundingsources_objectiveName: "{Objective Name}",
    fundingsources_description: "description here",
    fundingsources_targets: "targets here",
    fundingsources_includesTargets: false,
    fundingsources_additionalDetails: "additional details",
  };
  reportFieldDataEntities = [tempEntity, tempEntity];

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

  return (
    <Box>
      {verbiage.intro && <ReportPageIntro text={verbiage.intro} />}
      <Box>
        <Heading as="h3" sx={sx.dashboardTitle}>
          {verbiage.dashboardTitle}
        </Heading>
        {accordion && <InstructionsAccordion verbiage={accordion} />}
        <Box>
          {reportFieldDataEntities.map(
            (entity: EntityShape, entityIndex: number) => (
              <EntityCard
                key={entity.id}
                entity={entity}
                entityIndex={entityIndex}
                entityType={entityType}
                verbiage={verbiage}
                formattedEntityData={getFormattedEntityData()}
                openAddEditEntityModal={openAddEditEntityModal}
                openDeleteEntityModal={openDeleteEntityModal}
              />
            )
          )}
          <Button
            sx={sx.addEntityButton}
            onClick={addEditEntityModalOnOpenHandler}
            leftIcon={<Image sx={sx.buttonIcons} src={addIcon} alt="Add" />}
          >
            {verbiage.addEntityButtonText}
          </Button>
        </Box>
        <hr />
        {/* MODALS */}
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
      </Box>
      <ReportPageFooter />
    </Box>
  );
};

interface Props {
  accordion?: AnyObject;
  route: OverlayModalPageShape;
  validateOnRender?: boolean;
}

const sx = {
  buttonIcons: {
    height: "1rem",
  },
  dashboardTitle: {
    paddingBottom: "0",
    fontWeight: "bold",
    color: "palette.gray_medium",
  },
  addEntityButton: {
    marginTop: "1.5rem",
    marginBottom: "2rem",
  },
  table: {},
  reviewPdfButton: { marginTop: "1.5rem", marginBottom: "2rem" },
};
