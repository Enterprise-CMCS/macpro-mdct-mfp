import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
// components
import { CloseOutModal, Form, ReportPageIntro } from "components";
// types
import {
  DynamicModalOverlayReportPageShape,
  EntityShape,
  ErrorVerbiage,
  FormJson,
  ModalOverlayReportPageShape,
  ReportType,
} from "types";
// utils
import {
  isClosedInitiative,
  isFieldElement,
  toggleOptional,
  translate,
  useStore,
} from "utils";
// assets
import arrowLeftBlue from "assets/icons/icon_arrow_left_blue.png";
import previousIcon from "assets/icons/icon_previous_blue.png";

export const EntityDetailsOverlayV2 = ({
  backButtonText,
  closeEntityDetailsOverlay,
  disabled = false,
  editable = true,
  errorMessage,
  form = {} as FormJson,
  onSubmit,
  route,
  selectedEntity,
  submitting = false,
  validateOnRender = false,
}: Props) => {
  const [autosave, setAutosave] = useState<boolean>(true);
  const [formJson, setFormJson] = useState<FormJson>(form);
  // Use separate entity from selectedEntity for form change
  const [currentEntity, setCurrentEntity] = useState<EntityShape>(
    selectedEntity as EntityShape,
  );

  console.log("EntityDetailsOverlayV2");

  const { report, fields, setAnswer } = useStore();
  // Closed initiatives are locked in the Work Plan, but stay editable in the
  // SAR so state users can continue reporting on them.
  const isWP = report?.reportType === ReportType.WP;

  const isDisabled =
    disabled || Boolean(currentEntity?.isInitiativeClosed && isWP);
  const viewOnly = !editable || isDisabled;
  const getSaveButtonText = () => {
    return viewOnly ? "Return" : "Save & return";
  };
  const submitProps = viewOnly
    ? { onClick: () => closeEntityDetailsOverlay() }
    : { form: form.id };

  const closeOutModal = useDisclosure();

  const closeOutFields = form.fields?.filter((f) => f.forCopyoverOnly) || [];

  const isClosed = isClosedInitiative(currentEntity);
  const showCloseOut =
    Boolean(currentEntity?.isCopied) && closeOutFields.length > 0;

  // The title/hint/modalTitle/modalHint all live on the same close-out field.
  const closeOutFieldProps = closeOutFields
    .filter(isFieldElement)
    .find((field) => field.props)?.props;
  const initiativeName = currentEntity?.initiative_name;

  // The title renders on the page next to the button, and is stripped from the
  // modal's copy of the field so the heading isn't duplicated inside the modal.
  const closeOutTitle = closeOutFieldProps?.title
    ? translate(closeOutFieldProps.title, { initiativeName })
    : "Close-out";

  // The modal uses its own heading; fall back to the page title if unset.
  const closeOutModalTitle = closeOutFieldProps?.modalTitle
    ? translate(closeOutFieldProps.modalTitle, { initiativeName })
    : closeOutTitle;

  // The close-out hint renders on the page under the heading; it's stripped from
  // the modal's copy of the field so it isn't duplicated inside the modal.
  const closeOutHint = closeOutFieldProps?.hint
    ? translate(closeOutFieldProps.hint, { initiativeName })
    : undefined;

  // The close-out modal hint renders under the modal heading.
  const closeOutModalHint = closeOutFieldProps?.modalHint
    ? translate(closeOutFieldProps.modalHint, { initiativeName })
    : undefined;

  const closeOutForm = toggleOptional(
    {
      ...form,
      fields: closeOutFields.map((field) =>
        isFieldElement(field) && (field.props?.title || field.props?.hint)
          ? {
              ...field,
              props: { ...field.props, title: undefined, hint: undefined },
            }
          : field
      ),
    },
    isClosed
  );

  const updateCloseoutSection = useCallback(
    (entity: EntityShape) => {
      // keep autosave on in the SAR so edits to closed initiatives persist
      setAutosave(!isClosedInitiative(entity) || !isWP);
      setFormJson({
        ...form,
        fields: form.fields?.filter((f) => !f.forCopyoverOnly) || [],
      });
    },
    [form, isWP],
  );

  const onFormChange = () => {
    //TO DO: FIX THIS
    const currentValues = hookForm.getValues() as EntityShape;
    const endDate = currentValues.defineInitiative_endDate;

    // Keep the read-only close-out projected end date in sync with the
    // initiative end date so the modal shows the latest value.
    if (
      endDate &&
      endDate !== currentEntity?.closeOutInformation_projectedEndDate
    ) {
      setCurrentEntity({
        ...currentEntity,
        ...currentValues,
        closeOutInformation_projectedEndDate: endDate,
      });
    }
  };

  useEffect(() => {
    if (currentEntity) updateCloseoutSection(currentEntity);
  }, [
    currentEntity?.closeOutInformation_actualEndDate,
    currentEntity?.isCopied,
  ]);

  useEffect(() => {
    if (selectedEntity) setCurrentEntity(selectedEntity as EntityShape);
  }, [selectedEntity?.id, selectedEntity?.isInitiativeClosed]);

  return (
    <Box>
      <Button
        leftIcon={<Image sx={sx.backIcon} src={arrowLeftBlue} alt="" />}
        sx={sx.backButton}
        variant="none"
        onClick={() => closeEntityDetailsOverlay()}
        aria-label={backButtonText}
      >
        {backButtonText}
      </Button>
      <ReportPageIntro
        accordion={form.verbiage?.accordion}
        initiativeName={currentEntity?.initiative_name}
        text={{
          ...form.verbiage?.intro,
          section: route.name,
        }}
      />
      {form.fields && (
        <Form
          autosave={autosave}
          className="overlay-form"
          disabled={isDisabled}
          dontReset={true}
          formData={currentEntity}
          formJson={formJson}
          id={form.id}
          onFormChange={onFormChange}
          onSubmit={onSubmit}
          validateOnRender={validateOnRender}
        />
      )}
      {showCloseOut && (
        <Box sx={sx.closeOutSection}>
          <Heading as="h2" sx={sx.closeOutHeading}>
            {closeOutTitle}
          </Heading>
          {closeOutHint && <Text sx={sx.closeOutHint}>{closeOutHint}</Text>}
          <Button
            onClick={closeOutModal.onOpen}
            variant={isClosed ? "outline" : undefined}
          >
            {isClosed
              ? "View close-out information"
              : "Update close-out status"}
          </Button>
          <CloseOutModal
            disabled={isDisabled}
            entityType={currentEntity?.type as string}
            errorMessage={errorMessage}
            form={closeOutForm}
            heading={closeOutModalTitle}
            subheading={closeOutModalHint}
            modalDisclosure={{
              isOpen: closeOutModal.isOpen,
              onClose: closeOutModal.onClose,
            }}
            selectedEntity={currentEntity}
          />
        </Box>
      )}
      <Box sx={sx.footerBox}>
        <Flex sx={sx.buttonFlex}>
          <Button
            leftIcon={<Image sx={sx.backIcon} src={previousIcon} alt="" />}
            onClick={() => closeEntityDetailsOverlay()}
            variant="outline"
          >
            Previous
          </Button>
          <Button
            disabled={submitting}
            sx={sx.saveButton}
            type="submit"
            {...submitProps}
          >
            {submitting ? <Spinner size="md" /> : getSaveButtonText()}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

interface Props {
  backButtonText?: string;
  closeEntityDetailsOverlay: Function;
  disabled?: boolean;
  editable?: boolean;
  errorMessage?: ErrorVerbiage;
  form?: FormJson;
  onSubmit: Function;
  route: ModalOverlayReportPageShape | DynamicModalOverlayReportPageShape;
  selectedEntity?: EntityShape;
  setEntering: Function;
  submitting?: boolean;
  validateOnRender?: boolean;
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
  backIcon: {
    color: "primary",
    height: "1rem",
  },
  closeIcon: {
    width: "0.85rem",
  },
  closeOutSection: {
    marginTop: "spacer4",
  },
  closeOutHeading: {
    fontSize: "xl",
    marginBottom: "spacer2",
  },
  closeOutHint: {
    color: "gray",
    marginBottom: "spacer3",
  },
  footerBox: {
    marginTop: "spacer4",
    borderTop: "1.5px solid var(--mdct-colors-gray_light)",
  },
  buttonFlex: {
    justifyContent: "space-between",
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
};
