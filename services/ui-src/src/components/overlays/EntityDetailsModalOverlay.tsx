// components
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import {
  AddEditEntityModal,
  DeleteEntityModal,
  EntityCard,
  ReportPageIntro,
} from "components";
// types
import { EntityDetailsModalOverlayShape, EntityShape } from "types";
// utils
import { getFormattedEntityData, useStore } from "utils";
// assets
import addIcon from "assets/icons/icon_add_white.png";
import arrowLeftBlue from "assets/icons/icon_arrow_left_blue.png";
import { MouseEventHandler, useState } from "react";

export const EntityDetailsModalOverlay = ({
  selectedEntity,
  route,
  closeEntityDetailsOverlay,
}: Props) => {
  const submitting = false;
  const { modalForm, verbiage, entityType } = route;
  const { report } = useStore();

  const [currentEntity, setCurrentEntity] = useState<EntityShape | undefined>(
    undefined
  );

  // display variables
  let reportFieldDataEntities = report?.fieldData[entityType] || [];

  const dashTitle = `${verbiage.dashboardTitle}${
    verbiage.countEntitiesInTitle ? `: ${reportFieldDataEntities.length}` : ""
  }`;

  // add/edit entity modal disclosure and methods
  const {
    isOpen: addEditEntityModalIsOpen,
    onOpen: addEditEntityModalOnOpenHandler,
    onClose: addEditEntityModalOnCloseHandler,
  } = useDisclosure();

  const openAddEditEntityModal = (entity?: EntityShape) => {
    if (entity) setCurrentEntity(entity);
    addEditEntityModalOnOpenHandler();
  };

  const closeAddEditEntityModal = () => {
    setCurrentEntity(undefined);
    addEditEntityModalOnCloseHandler();
  };

  // delete modal disclosure and methods
  const {
    isOpen: deleteEntityModalIsOpen,
    onOpen: deleteEntityModalOnOpenHandler,
    onClose: deleteEntityModalOnCloseHandler,
  } = useDisclosure();

  const openDeleteEntityModal = (entity?: EntityShape) => {
    setCurrentEntity(entity);
    deleteEntityModalOnOpenHandler();
  };

  const closeDeleteEntityModal = () => {
    setCurrentEntity(undefined);
    deleteEntityModalOnCloseHandler();
  };

  return (
    <Box>
      <Button
        sx={sx.backButton}
        variant="none"
        onClick={closeEntityDetailsOverlay as MouseEventHandler}
        aria-label="Return to dashboard for this initiative"
      >
        <Image src={arrowLeftBlue} alt="Arrow left" sx={sx.backIcon} />
        Return to dashboard for this initiative
      </Button>
      {verbiage.intro && (
        <ReportPageIntro
          sx={sx.intro}
          text={verbiage.intro}
          accordion={verbiage.accordion}
          initiativeName={selectedEntity!.initiative_name}
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
          {reportFieldDataEntities?.map(
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
          {reportFieldDataEntities.length > 1 && (
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
          selectedEntity={currentEntity}
          verbiage={verbiage}
          form={modalForm}
          modalDisclosure={{
            isOpen: addEditEntityModalIsOpen,
            onClose: closeAddEditEntityModal,
          }}
        />
        <DeleteEntityModal
          entityType={entityType}
          selectedEntity={currentEntity}
          verbiage={verbiage}
          modalDisclosure={{
            isOpen: deleteEntityModalIsOpen,
            onClose: closeDeleteEntityModal,
          }}
        />
      </Box>
      <Box sx={sx.footerBox}>
        <Flex sx={sx.buttonFlex}>
          <Button type="submit" form={modalForm.id} sx={sx.saveButton}>
            {submitting ? <Spinner size="md" /> : "Save & return"}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

interface Props {
  selectedEntity?: EntityShape;
  route: EntityDetailsModalOverlayShape;
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
    color: "#5B616B",
  },
  footerBox: {
    marginTop: "2rem",
    borderTop: "1.5px solid var(--chakra-colors-palette-gray_light)",
  },
  buttonFlex: {
    justifyContent: "end",
    marginY: "1.5rem",
  },
  saveButton: {
    width: "8.25rem",
  },
  warningBanner: {
    marginTop: "3.5rem",
    marginBottom: "2rem",
    bgColor: "palette.warn_lightest",
    borderInlineStartColor: "palette.warn",
  },
  warningIcon: {
    width: "1.375rem",
  },
  buttonIcons: {
    height: "1rem",
  },
  addEntityButton: {
    marginTop: "1.5rem",
    marginBottom: "2rem",
  },
  dashboardTitle: {
    paddingTop: "1rem",
    paddingBottom: "0",
    fontWeight: "bold",
    color: "palette.gray_medium",
  },
};
