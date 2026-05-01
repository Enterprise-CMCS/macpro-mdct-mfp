import { useCallback, useEffect, useState } from "react";
import { Box, Button, Flex, Image, Spinner } from "@chakra-ui/react";
// components
import { Alert, Form, ReportPageIntro } from "components";
// types
import { FieldValues, UseFormReturn } from "react-hook-form";
import {
  AlertTypes,
  DynamicModalOverlayReportPageShape,
  EntityShape,
  ErrorVerbiage,
  FormJson,
  ModalOverlayReportPageShape,
} from "types";
// utils
import { isClosedInitiative, toggleOptional } from "utils";
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
  setSelectedEntity,
  validateOnRender = false,
}: Props) => {
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [formJson, setFormJson] = useState<FormJson>(form);

  const isDisabled = disabled || Boolean(selectedEntity?.isInitiativeClosed);
  const viewOnly = !editable || isDisabled;
  const getSaveButtonText = () => {
    return viewOnly ? "Return" : "Save & return";
  };
  const submitProps = viewOnly
    ? { onClick: () => closeEntityDetailsOverlay() }
    : { form: form.id };

  const getFields = (entity?: EntityShape) => {
    const fields = entity?.isCopied
      ? form.fields
      : form.fields?.filter((f) => !f.forCopyoverOnly);
    return fields || [];
  };

  const updateCloseoutSection = useCallback(
    (entity: EntityShape) => {
      const isClosed = isClosedInitiative(entity);
      const fields = getFields(entity);

      setShowAlert(isClosed);
      setFormJson(toggleOptional({ ...form, fields }, isClosed));
    },
    [form]
  );

  const onFormChange = (hookForm: UseFormReturn<FieldValues, any>) => {
    const currentValues = hookForm.getValues() as EntityShape;
    updateCloseoutSection(currentValues);
  };

  useEffect(() => {
    setSelectedEntity(selectedEntity);
    if (selectedEntity) updateCloseoutSection(selectedEntity);
    return () => {
      setSelectedEntity(undefined);
    };
  }, [selectedEntity]);

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
        initiativeName={selectedEntity?.initiative_name}
        text={{
          ...form.verbiage?.intro,
          section: route.name,
        }}
      />
      {form.fields && (
        <Form
          autosave={true}
          className="overlay-form"
          disabled={isDisabled}
          dontReset={true}
          formData={selectedEntity}
          formJson={formJson}
          id={form.id}
          onFormChange={onFormChange}
          onSubmit={onSubmit}
          validateOnRender={validateOnRender}
        />
      )}
      {showAlert && errorMessage && (
        <Alert
          description={errorMessage.description}
          status={AlertTypes.WARNING}
          title={errorMessage.title}
        />
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
          <Button sx={sx.saveButton} type="submit" {...submitProps}>
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
  setSelectedEntity: Function;
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
