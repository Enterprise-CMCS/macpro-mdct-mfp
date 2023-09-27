// components
import {
  Box,
  Button,
  Flex,
  Image,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { Alert, Form, ReportPageIntro, CloseEntityModal } from "components";
// types
import { AlertTypes, EntityDetailsOverlayShape } from "types";
// assets
import closeIcon from "assets/icons/icon_cancel_x_white.png";
import arrowLeftBlue from "assets/icons/icon_arrow_left_blue.png";
import warningIcon from "assets/icons/icon_warning.png";

export const EntityDetailsOverlay = ({ route, validateOnRender }: Props) => {
  const submitting = false;
  const { form, verbiage } = route;

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

  return (
    <Box>
      <Button
        sx={sx.backButton}
        variant="none"
        //TO-DO: add onClick prop to go back to initiative dashboard
        aria-label="Return to dashboard for this initiative"
      >
        <Image src={arrowLeftBlue} alt="Arrow left" sx={sx.backIcon} />
        Return to dashboard for this initiative
      </Button>

      {verbiage.intro && <ReportPageIntro text={verbiage.intro} />}
      <Form
        id={form.id}
        formJson={form}
        onSubmit={() => {}}
        autosave
        validateOnRender={validateOnRender || false}
        dontReset={false}
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
              verbiage={verbiage}
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
