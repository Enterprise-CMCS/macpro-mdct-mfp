import { MouseEventHandler, useContext, useEffect } from "react";
// components
import {
  Box,
  Button,
  Flex,
  Image,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import {
  Alert,
  Form,
  ReportPageIntro,
  CloseEntityModal,
  ReportContext,
} from "components";
// types
import {
  AlertTypes,
  EntityDetailsOverlayShape,
  AnyObject,
  isFieldElement,
  EntityShape,
  ReportStatus,
} from "types";
// assets
import closeIcon from "assets/icons/icon_cancel_x_white.png";
import arrowLeftBlue from "assets/icons/icon_arrow_left_blue.png";
import warningIcon from "assets/icons/icon_warning.png";
// utils
import {
  entityWasUpdated,
  getEntriesToClear,
  filterFormData,
  setClearedEntriesToDefaultValue,
  useStore,
} from "utils";

export const EntityDetailsOverlay = ({
  route,
  closeEntityDetailsOverlay,
  validateOnRender,
}: Props) => {
  const submitting = false;
  const { entityType, form, verbiage } = route;
  const { report, selectedEntity, setSelectedEntity } = useStore();

  const { full_name, state } = useStore().user ?? {};
  const { updateReport } = useContext(ReportContext);

  /**
   * Any time the report is updated on this page,
   * we also want to update the selectedEntity in the store
   * with new data that the report was given.
   */
  useEffect(() => {
    if (selectedEntity) {
      setSelectedEntity(
        report?.fieldData?.[selectedEntity.type].find(
          (entity: EntityShape) => entity.id == selectedEntity.id
        )
      );
    }
  }, [report]);

  // add/edit entity modal disclosure and methods
  const {
    isOpen: closeEntityModalIsOpen,
    onOpen: closeEntityModalOnOpenHandler,
    onClose: closeEntityModalOnCloseHandler,
  } = useDisclosure();

  const openCloseEntityModal = () => {
    closeEntityModalOnOpenHandler();
  };

  const closeCloseEntityModal = () => {
    closeEntityModalOnCloseHandler();
  };

  const onSubmit = async (enteredData: AnyObject) => {
    const reportKeys = {
      reportType: report?.reportType,
      state: state,
      id: report?.id,
    };

    let dataToWrite = {
      metadata: {
        lastAlteredBy: full_name,
        status: ReportStatus.IN_PROGRESS,
      },
      fieldData: {},
    };

    const currentEntities = [...(report?.fieldData?.[entityType] || [])];
    const filteredFormData = filterFormData(
      enteredData,
      form.fields.filter(isFieldElement)
    );

    if (selectedEntity?.id) {
      // if existing entity selected, edit
      const entriesToClear = getEntriesToClear(
        enteredData,
        form.fields.filter(isFieldElement)
      );
      const selectedEntityIndex = currentEntities.findIndex(
        (entity: EntityShape) => entity.id === selectedEntity.id
      );
      const updatedEntities = currentEntities;

      updatedEntities[selectedEntityIndex] = {
        id: selectedEntity.id,
        type: selectedEntity.type,
        ...currentEntities[selectedEntityIndex],
        ...filteredFormData,
      };

      updatedEntities[selectedEntityIndex] = setClearedEntriesToDefaultValue(
        updatedEntities[selectedEntityIndex],
        entriesToClear
      );

      dataToWrite.fieldData = { [entityType]: updatedEntities };
      const shouldSave = entityWasUpdated(
        report?.fieldData?.[entityType][selectedEntityIndex],
        updatedEntities[selectedEntityIndex]
      );
      if (shouldSave) await updateReport(reportKeys, dataToWrite);
    }
    closeEntityDetailsOverlay!();
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
          initiativeName={selectedEntity!.initiative_name}
        />
      )}
      <Form
        id={form.id}
        formJson={form}
        onSubmit={onSubmit}
        autosave={true}
        formData={selectedEntity}
        validateOnRender={validateOnRender || false}
        dontReset={true}
      />
      <Box>
        {verbiage.closeOutWarning && (
          <Alert
            title={verbiage.closeOutWarning.title}
            showIcon={true}
            icon={warningIcon}
            status={AlertTypes.WARNING}
            description={verbiage.closeOutWarning.description}
            sx={sx.warningBanner}
          />
        )}
      </Box>
      <Box>
        {verbiage.closeOutModal && (
          <Box>
            <Button
              rightIcon={
                <Image src={closeIcon} alt="Close" sx={sx.closeIcon} />
              }
              onClick={() => openCloseEntityModal()}
            >
              {verbiage.closeOutModal.closeOutModalButtonText}
            </Button>
            <CloseEntityModal
              entityName={selectedEntity!.initiative_name}
              selectedEntity={selectedEntity}
              route={route}
              modalDisclosure={{
                isOpen: closeEntityModalIsOpen,
                onClose: closeCloseEntityModal,
              }}
            />
          </Box>
        )}
      </Box>
      <Box sx={sx.footerBox}>
        <Flex sx={sx.buttonFlex}>
          <Button type="submit" form={form.id} sx={sx.saveButton}>
            {submitting ? <Spinner size="md" /> : "Save & return"}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

interface Props {
  route: EntityDetailsOverlayShape;
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
  closeIcon: {
    width: "0.85rem",
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
};
