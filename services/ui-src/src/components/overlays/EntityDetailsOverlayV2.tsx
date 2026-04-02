import { useEffect } from "react";
import { Box, Button, Flex, Image, Spinner } from "@chakra-ui/react";
// components
import { EntityProvider, Form, ReportPageIntro } from "components";
// types
import { EntityShape, FormJson, ModalOverlayReportPageShape } from "types";
// assets
import arrowLeftBlue from "assets/icons/icon_arrow_left_blue.png";

export const EntityDetailsOverlayV2 = ({
  backButtonText,
  closeEntityDetailsOverlay,
  disabled = false,
  editable = true,
  form = {} as FormJson,
  onSubmit,
  route,
  selectedEntity,
  submitting = false,
  setEntering,
  validateOnRender,
}: Props) => {
  const getSaveButtonText = () => {
    return editable && !selectedEntity?.isInitiativeClosed
      ? "Save & return"
      : "Return";
  };
  useEffect(() => {
    setEntering(false);
  }, []);

  return (
    <EntityProvider>
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
            autosave={false}
            className="overlay-form"
            disabled={disabled}
            dontReset={true}
            formData={selectedEntity}
            formJson={form}
            id={form.id}
            onSubmit={onSubmit}
            validateOnRender={validateOnRender || false}
          />
        )}
        <Box sx={sx.footerBox}>
          <Flex sx={sx.buttonFlex}>
            <Button type="submit" form={form.id} sx={sx.saveButton}>
              {submitting ? <Spinner size="md" /> : getSaveButtonText()}
            </Button>
          </Flex>
        </Box>
      </Box>
    </EntityProvider>
  );
};

interface Props {
  backButtonText?: string;
  closeEntityDetailsOverlay: Function;
  disabled?: boolean;
  editable?: boolean;
  form?: FormJson;
  onSubmit: Function;
  route: ModalOverlayReportPageShape;
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
};
