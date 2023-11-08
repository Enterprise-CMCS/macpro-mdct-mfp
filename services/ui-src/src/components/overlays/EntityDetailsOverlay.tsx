import { MouseEventHandler, useContext, useEffect, useState } from "react";
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
}: Props) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { entityType, form, verbiage } = route;
  const { report, selectedEntity, setSelectedEntity } = useStore();
  const [disableCloseOut, setDisableCloseOut] = useState<boolean>(false);

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
        report?.fieldData?.[entityType][selectedEntityIndex],
        updatedEntities[selectedEntityIndex]
      );
      if (shouldSave) await updateReport(reportKeys, dataToWrite);
    }

    setSubmitting(false);
    closeEntityDetailsOverlay!();
  };

  const onChange = (event: HTMLFormElement) => {
    //due to the blur, the last item change does not always update fast enough. this function will merge the last changed data to a copy of the entity
    let entityClone = structuredClone(selectedEntity);
    if (entityClone) {
      //if the field is an array, it's probably a checkbox or a radio button
      if (typeof entityClone[event.nativeEvent.target.name] === "object") {
        //filter out the data to remove any possible copy of this object from the array
        var filteredFields = (
          entityClone[event.nativeEvent.target.name] as []
        ).filter(
          (field: AnyObject) => field.value !== event.nativeEvent.target.value
        );

        //add it back in if the current checked is true
        if (event.nativeEvent.target.checked)
          (filteredFields as any).push({
            key: event.nativeEvent.target.id,
            value: event.nativeEvent.target.value,
          });

        entityClone[event.nativeEvent.target.name] = filteredFields;
      } else {
        //non object fields tend to be a string or a number, so a direct replacement is acceptable
        entityClone[event.nativeEvent.target.name] =
          event.nativeEvent.target.value;
      }

      //passed the updated entityClone to be used to check for the closeout status
      setDisableCloseOut(!getCloseoutStatus(form, entityClone));
    }
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
        dontReset={true}
        onChange={onChange}
        validateOnRender={false}
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
