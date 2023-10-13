import { MouseEventHandler, useState } from "react";
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
  EntityStepCard,
} from "components";
// assets
import addIcon from "assets/icons/icon_add_white.png";
import arrowLeftBlue from "assets/icons/icon_arrow_left_blue.png";
// types
import { EntityShape, OverlayModalPageShape } from "types";
// utils
import { getFormattedEntityData, resetClearProp, useStore } from "utils";

export const OverlayModalPage = ({
  entity,
  closeEntityDetailsOverlay,
  route,
}: Props) => {
  const { entityType, verbiage, modalForm, stepType } = route;
  const { report, selectedEntity: currentEntity } = useStore();
  const [selectedEntity, setSelectedEntity] = useState<EntityShape | undefined>(
    undefined
  );

  const reportFieldDataEntities = report?.fieldData[entityType] || [];

  // display only the currently selected entity steps
  let reportFieldDataEntitySteps: EntityShape[] =
    reportFieldDataEntities.filter((entity: EntityShape) => {
      if (currentEntity && entity.id === currentEntity.id) {
        if (
          Object.keys(entity).findIndex((key: string) =>
            key.includes(stepType)
          ) > 0
        ) {
          return entity;
        }
      }
      return;
    });

  const dashTitle = `${verbiage.dashboardTitle}${
    verbiage.countEntitiesInTitle
      ? `: ${reportFieldDataEntitySteps.length}`
      : ""
  }`;

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
    resetClearProp(modalForm.fields);
    deleteEntityModalOnOpenHandler();
  };

  const closeDeleteEntityModal = () => {
    setSelectedEntity(undefined);
    deleteEntityModalOnCloseHandler();
  };

  return (
    <Box>
      {entity && (
        <Button
          sx={sx.backButton}
          variant="none"
          onClick={closeEntityDetailsOverlay as MouseEventHandler}
          aria-label="Return to dashboard for this initiative"
        >
          <Image src={arrowLeftBlue} alt="Arrow left" sx={sx.backIcon} />
          Return to dashboard for this initiative
        </Button>
      )}
      {verbiage.intro && (
        <ReportPageIntro
          sx={sx.intro}
          text={verbiage.intro}
          accordion={verbiage.accordion}
        />
      )}
      <Box>
        <Button
          sx={sx.addEntityButton}
          onClick={addEditEntityModalOnOpenHandler}
          leftIcon={<Image sx={sx.buttonIcons} src={addIcon} alt="Add" />}
        >
          {verbiage.addEntityButtonText}
        </Button>
        <Heading as="h3" sx={sx.dashboardTitle}>
          {dashTitle}
        </Heading>
        <Box>
          {reportFieldDataEntitySteps?.map(
            (entity: EntityShape, entityIndex: number) => (
              <EntityStepCard
                key={entity.id}
                entity={entity}
                entityIndex={entityIndex}
                stepType={stepType}
                verbiage={verbiage}
                formattedEntityData={getFormattedEntityData(stepType, entity)}
                openAddEditEntityModal={openAddEditEntityModal}
                openDeleteEntityModal={openDeleteEntityModal}
              />
            )
          )}
          {reportFieldDataEntitySteps.length > 1 && (
            <Button
              sx={sx.addEntityButton}
              onClick={addEditEntityModalOnOpenHandler}
              leftIcon={<Image sx={sx.buttonIcons} src={addIcon} alt="Add" />}
            >
              {verbiage.addEntityButtonText}
            </Button>
          )}
        </Box>
        <hr />
        {/* MODALS */}
        <AddEditEntityModal
          entityType={entityType}
          selectedEntity={entity}
          entityName={entity!.initiative_name}
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
            Save & return
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

interface Props {
  route: OverlayModalPageShape;
  entity?: EntityShape;
  closeEntityDetailsOverlay?: Function;
  validateOnRender?: boolean;
}

const sx = {
  backButton: {
    padding: 0,
    fontWeight: "normal",
    color: "palette.primary",
    display: "flex",
    position: "relative",
    right: "3rem",
    marginBottom: "2rem",
    marginTop: "-2rem",
  },
  backIcon: {
    color: "palette.primary",
    height: "1rem",
    marginRight: "0.5rem",
  },
  intro: {
    color: "palette.gray_medium",
  },
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
