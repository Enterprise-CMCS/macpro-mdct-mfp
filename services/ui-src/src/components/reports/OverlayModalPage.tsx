import { useState } from "react";
// components
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import {
  AddEditEntityModal,
  DeleteEntityModal,
  ReportPageIntro,
} from "components";
// assets
import addIcon from "assets/icons/icon_add.png";
// types
import { EntityShape, OverlayModalPageShape } from "types";
import { EntityCard } from "components/cards/EntityCard";
import { getFormattedEntityData } from "utils/reports/entities";
import { useStore } from "utils";
// utils

export const OverlayModalPage = ({ route }: Props) => {
  const { entityType, verbiage, modalForm } = route;
  const { report } = useStore();
  const [selectedEntity, setSelectedEntity] = useState<EntityShape | undefined>(
    undefined
  );

  //display variables
  const reportFieldDataEntities = report?.fieldData[entityType] || [];
  const dashTitle = `${verbiage.dashboardTitle} ${reportFieldDataEntities.length}`;

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

  const openDeleteEntityModal = (entity?: EntityShape) => {
    setSelectedEntity(entity);
    deleteEntityModalOnOpenHandler();
  };

  const closeDeleteEntityModal = () => {
    setSelectedEntity(undefined);
    deleteEntityModalOnCloseHandler();
  };

  return (
    <Box>
      {verbiage.intro && (
        <ReportPageIntro text={verbiage.intro} accordion={verbiage.accordion} />
      )}
      <Box>
        <Heading as="h3" sx={sx.dashboardTitle}>
          {dashTitle}
        </Heading>
        <Box>
          {reportFieldDataEntities.map(
            (entity: EntityShape, entityIndex: number) => (
              <EntityCard
                key={entity.id}
                entity={entity}
                entityIndex={entityIndex}
                entityType={entityType}
                verbiage={verbiage}
                formattedEntityData={getFormattedEntityData(entityType, entity)}
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
          entityType={entityType}
          selectedEntity={selectedEntity}
          verbiage={verbiage}
          form={modalForm}
          modalDisclosure={{
            isOpen: addEditEntityModalIsOpen,
            onClose: closeAddEditEntityModal,
          }}
        />
        <DeleteEntityModal
          entityType={entityType}
          selectedEntity={selectedEntity}
          verbiage={verbiage}
          modalDisclosure={{
            isOpen: deleteEntityModalIsOpen,
            onClose: closeDeleteEntityModal,
          }}
        />
      </Box>
      <Box>
        <Flex sx={sx.buttonFlex}>
          <Button type="submit" form={modalForm.id} sx={sx.saveButton}>
            Save & return"
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

interface Props {
  route: OverlayModalPageShape;
  validateOnRender?: boolean;
}

const sx = {
  buttonIcons: {
    height: "1rem",
  },
  dashboardTitle: {
    paddingTop: "1rem",
    paddingBottom: "0",
    fontWeight: "bold",
    color: "palette.gray_medium",
  },
  addEntityButton: {
    marginTop: "1.5rem",
    marginBottom: "2rem",
  },
  buttonFlex: {
    justifyContent: "end",
    marginY: "1.5rem",
  },
  saveButton: {
    width: "8.25rem",
  },
};
