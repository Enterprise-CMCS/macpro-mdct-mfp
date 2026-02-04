import { useContext, useEffect, useState } from "react";
// components
import {
  Box,
  Button,
  Flex,
  Image,
  Spinner,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import {
  Alert,
  Form,
  ReportPageIntro,
  CloseEntityModal,
  ReportContext,
  PrintButton,
} from "components";
import { getCloseoutStatus } from "components/tables/getEntityStatus";
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
import closeGrayIcon from "assets/icons/icon_cancel_x_gray.png";
import arrowLeftBlue from "assets/icons/icon_arrow_left_blue.png";
// utils
import {
  entityWasUpdated,
  getEntriesToClear,
  filterFormData,
  setClearedEntriesToDefaultValue,
  useStore,
  parseCustomHtml,
} from "utils";

export const EntityDetailsOverlay = ({
  route,
  closeEntityDetailsOverlay,
}: Props) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { entityType, form, verbiage } = route;
  const { report, selectedEntity, setSelectedEntity, autosaveState, editable } =
    useStore();
  const [disableCloseOut, setDisableCloseOut] = useState<boolean>();

  const { full_name, state } = useStore().user ?? {};
  const { updateReport } = useContext(ReportContext);
  const [spinner, setSpinner] = useState<Boolean>();

  const reportPageTitle = selectedEntity?.isInitiativeClosed
    ? `[Closed] ${selectedEntity?.initiative_name}`
    : `${selectedEntity?.initiative_name}`;

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
    if (selectedEntity?.isInitiativeClosed) {
      setDisableCloseOut(true);
    }
  }, [report, selectedEntity?.isInitiativeClosed]);

  //need to set the initial state of the closeOut button when page loads
  if (disableCloseOut === undefined) {
    const closedOut =
      selectedEntity?.isInitiativeClosed ??
      !getCloseoutStatus(form, selectedEntity!);
    setDisableCloseOut(closedOut);
  }

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

  useEffect(() => {
    //if spinner is active, that means the user has clicked the return button and if autosaveState is false, that means autosave had finished saving
    if (spinner && !autosaveState) {
      setSpinner(false);

      //sometimes autosave runs a sec before submit, so we want to stop the spinner here
      setSubmitting(false);
      if (closeEntityDetailsOverlay) {
        //call the function to return to the dashboard
        closeEntityDetailsOverlay();
      }
    }
  }, [autosaveState, spinner]);

  const returnToDashboard = () => {
    if (!spinner) setSpinner(true);
  };

  const onSubmit = async (enteredData: AnyObject) => {
    setSubmitting(true);
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
        report?.fieldData?.[entityType]?.[selectedEntityIndex],
        updatedEntities[selectedEntityIndex]
      );
      if (shouldSave) await updateReport(reportKeys, dataToWrite);
    }

    returnToDashboard!();
  };

  //used to get the exact form values to enable/disable close out button
  const onChange = (formProvider: AnyObject) => {
    if (selectedEntity) {
      let entity: EntityShape = {
        id: selectedEntity.id,
        type: selectedEntity.type,
      };

      //pulling the fields needed to build the entity to check the status of
      let fields = form.fields.flatMap((field: any) => {
        return { id: field.id, value: formProvider.getValues(field.id) };
      });

      //format the field data to match EntityShape
      fields.forEach((field: any) => {
        entity[field.id] = field.value;
      });

      //there's two nested textboxes the the user can fill out after checking the checkbox
      entity["closeOutInformation_initiativeStatus-alternateFunding"] =
        formProvider.getValues(
          "closeOutInformation_initiativeStatus-alternateFunding"
        );
      entity["closeOutInformation_initiativeStatus-terminationReason"] =
        formProvider.getValues(
          "closeOutInformation_initiativeStatus-terminationReason"
        );

      const isClosed =
        selectedEntity?.isInitiativeClosed ?? !getCloseoutStatus(form, entity);
      setDisableCloseOut(isClosed);
    }
  };

  return (
    <Box>
      <Button
        sx={sx.backButton}
        variant="none"
        onClick={returnToDashboard}
        aria-label="Return to dashboard for this initiative"
      >
        <Box sx={sx.backBox}>
          {spinner ? (
            <Spinner size="sm" sx={sx.backIcon} />
          ) : (
            <Image src={arrowLeftBlue} alt="Arrow left" sx={sx.backIcon} />
          )}
        </Box>
        Return to dashboard for this initiative
      </Button>

      {verbiage.intro && (
        <ReportPageIntro
          text={verbiage.intro}
          initiativeName={reportPageTitle}
        />
      )}
      {verbiage.intro.subtitle && (
        <Box sx={sx.infoTextBox}>
          {parseCustomHtml(verbiage.intro.subtitle)}
        </Box>
      )}
      <Form
        id={form.id}
        formJson={form}
        onSubmit={onSubmit}
        autosave={true}
        formData={selectedEntity}
        dontReset={true}
        onFormChange={onChange}
        validateOnRender={false}
      />
      <Box>
        {verbiage.closeOutWarning && (
          <Alert
            title={verbiage.closeOutWarning.title}
            status={AlertTypes.WARNING}
            description={verbiage.closeOutWarning.description}
          />
        )}
      </Box>
      <Box>
        {verbiage.closeOutModal && (
          <Box>
            <Button
              rightIcon={
                <Image
                  src={disableCloseOut ? closeGrayIcon : closeIcon}
                  alt="Close"
                  sx={sx.closeIcon}
                />
              }
              onClick={() => openCloseEntityModal()}
              disabled={disableCloseOut}
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
        {verbiage.reviewPdfHint && (
          <Box>
            <Text sx={sx.reviewPdfHint}>
              {parseCustomHtml(verbiage.reviewPdfHint)}
            </Text>
            <PrintButton sxOverride={sx.reviewPdfButton} />
          </Box>
        )}
      </Box>
      <Box sx={sx.footerBox}>
        <Flex sx={sx.buttonFlex}>
          <Button type="submit" form={form.id} sx={sx.saveButton}>
            {submitting ? (
              <Spinner size="md" />
            ) : editable && !selectedEntity?.isInitiativeClosed ? (
              "Save & return"
            ) : (
              "Return"
            )}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

interface Props {
  route: EntityDetailsOverlayShape;
  closeEntityDetailsOverlay?: Function;
}

const sx = {
  backButton: {
    padding: 0,
    fontWeight: "normal",
    color: "primary",
    display: "flex",
    position: "relative",
    right: 0,
    ".tablet &": {
      right: "spacer6",
    },
    marginBottom: "spacer4",
    marginTop: "-2rem",
  },
  backBox: {
    marginRight: "spacer1",
    width: "1rem",
  },
  backIcon: {
    color: "primary",
    height: "1.5rem",
    width: "1.5rem",
  },
  closeIcon: {
    width: "0.85rem",
  },
  footerBox: {
    marginTop: "spacer4",
    borderTop: "1.5px solid var(--mdct-colors-gray_light)",
  },
  buttonFlex: {
    justifyContent: "end",
    marginY: "spacer3",
  },
  saveButton: {
    width: "8.25rem",
  },
  warningIcon: {
    width: "1.375rem",
  },
  subsectionHeading: {
    fontWeight: "normal",
    fontSize: "4xl",
    marginTop: "spacer1",
  },
  infoTextBox: {
    marginTop: "spacer3",
    color: "gray",
    h3: {
      marginBottom: "-0.75rem",
    },
    "p, span": {
      color: "gray",
      marginTop: "spacer2",
    },
    a: {
      color: "primary",
      "&:hover": {
        color: "primary_darker",
      },
    },
    b: {
      color: "base",
    },
  },
  reviewPdfHint: {
    paddingTop: "spacer4",
    paddingBottom: "spacer4",
    color: "gray",
  },
  reviewPdfButton: { marginBottom: "spacer4" },
};
