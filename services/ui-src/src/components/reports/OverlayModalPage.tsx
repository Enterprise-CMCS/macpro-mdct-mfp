import { MouseEventHandler, useEffect, useState } from "react";
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
  AddEditOverlayEntityModal,
  DeleteEntityModal,
  ReportPageIntro,
  EntityStepCard,
} from "components";
// assets
import addIcon from "assets/icons/icon_add_white.png";
import arrowLeftBlue from "assets/icons/icon_arrow_left_blue.png";
// types
import { EntityShape, OverlayModalPageShape, ReportType } from "types";
// utils
import { getFormattedEntityData, resetClearProp, useStore } from "utils";

export const OverlayModalPage = ({
  closeEntityDetailsOverlay,
  route,
}: Props) => {
  const { verbiage, stepType } = route;
  const { report, selectedEntity, setSelectedEntity, editable } = useStore();
  const [selectedStepEntity, setSelectedStepEntity] = useState<
    EntityShape | undefined
  >(undefined);

  const entityType = selectedEntity!.type;
  const userDisabled = !editable || selectedEntity?.isInitiativeClosed;

  let modalForm = route.modalForm;
  if(!modalForm){
    modalForm = (route as any).objectiveCards[0].modalForm
  }

  /**
   * Any time the report is updated on this page,
   * we also want to update the selectedEntity in the store
   * with new data that the report was given.
   */
  useEffect(() => {
    if (selectedEntity) {
      setSelectedEntity(
        report?.fieldData?.[selectedEntity.type]?.find(
          (entity: EntityShape) => entity.id == selectedEntity.id
        )
      );
    }
  }, [report]);

  let reportFieldDataEntities =
    selectedEntity?.[stepType ? stepType : entityType] || [];

  const dashTitle = `${verbiage.dashboardTitle}${
    verbiage.countEntitiesInTitle ? `: ${reportFieldDataEntities.length}` : ""
  }`;

  const entityIdLookup = { [entityType]: selectedEntity?.id };

  // add/edit entity modal disclosure and methods
  const {
    isOpen: addEditEntityModalIsOpen,
    onOpen: addEditEntityModalOnOpenHandler,
    onClose: addEditEntityModalOnCloseHandler,
  } = useDisclosure();

  const openAddEditEntityModal = (entity?: EntityShape) => {
    if (entity) setSelectedStepEntity(entity);
    addEditEntityModalOnOpenHandler();
  };

  const closeAddEditEntityModal = () => {
    setSelectedStepEntity(undefined);
    addEditEntityModalOnCloseHandler();
  };

  // delete modal disclosure and methods
  const {
    isOpen: deleteEntityModalIsOpen,
    onOpen: deleteEntityModalOnOpenHandler,
    onClose: deleteEntityModalOnCloseHandler,
  } = useDisclosure();

  const openDeleteEntityModal = (entity?: EntityShape) => {
    setSelectedStepEntity(entity);
    resetClearProp(modalForm.fields);
    deleteEntityModalOnOpenHandler();
  };

  const closeDeleteEntityModal = () => {
    setSelectedStepEntity(undefined);
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
          text={verbiage.intro}
          accordion={verbiage.accordion}
          initiativeName={selectedEntity!.initiative_name}
          stepType={stepType}
        />
      )}
      <Box>
        {report?.reportType === ReportType.WP && (
          <>
            <Button
              sx={sx.addEntityButton}
              onClick={addEditEntityModalOnOpenHandler}
              rightIcon={<Image sx={sx.buttonIcons} src={addIcon} alt="Add" />}
            >
              {verbiage.addEntityButtonText}
            </Button>
            <Heading as="h3" sx={sx.dashboardTitle}>
              {dashTitle}
            </Heading>
          </>
        )}
        <Box>
          {reportFieldDataEntities?.map(
            (entity: EntityShape, entityIndex: number) => (
              <EntityStepCard
                key={entity.id}
                entity={entity}
                entityIndex={entityIndex}
                stepType={stepType}
                verbiage={verbiage}
                printVersion={false}
                formattedEntityData={getFormattedEntityData(stepType, entity)}
                openAddEditEntityModal={openAddEditEntityModal}
                openDeleteEntityModal={openDeleteEntityModal}
                disabled={userDisabled}
                hasBoxShadow={true}
              />
            )
          )}
          {reportFieldDataEntities.length > 1 &&
            report?.reportType === ReportType.WP && (
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
        <AddEditOverlayEntityModal
          entityType={[entityType, stepType]}
          selectedEntity={selectedStepEntity}
          entityName={selectedEntity!.initiative_name}
          entityIdLookup={entityIdLookup}
          verbiage={verbiage}
          form={modalForm}
          userDisabled={userDisabled}
          modalDisclosure={{
            isOpen: addEditEntityModalIsOpen,
            onClose: closeAddEditEntityModal,
          }}
        />
        <DeleteEntityModal
          entityType={[entityType, stepType]}
          entityIdLookup={entityIdLookup}
          selectedEntity={selectedStepEntity}
          verbiage={verbiage}
          modalDisclosure={{
            isOpen: deleteEntityModalIsOpen,
            onClose: closeDeleteEntityModal,
          }}
          userDisabled={userDisabled}
        />
      </Box>
      <Box>
        <Flex sx={sx.buttonFlex}>
          <Button
            type="button"
            form={modalForm.id}
            sx={sx.saveButton}
            onClick={closeEntityDetailsOverlay as MouseEventHandler}
          >
            {!userDisabled ? "Save & return" : "Return"}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

interface Props {
  route: OverlayModalPageShape;
  closeEntityDetailsOverlay?: Function;
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
  buttonIcons: {
    height: "1rem",
  },
  dashboardTitle: {
    paddingTop: "1rem",
    marginBottom: "1rem",
    fontWeight: "bold",
    color: "palette.gray_medium",
  },
  addEntityButton: {
    marginTop: "1.5rem",
    marginBottom: "1rem",
  },
  buttonFlex: {
    justifyContent: "end",
    marginY: "1.5rem",
  },
  saveButton: {
    width: "8.25rem",
  },
};
