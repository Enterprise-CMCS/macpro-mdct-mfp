import { ReactNode } from "react";
// components
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Modal as ChakraModal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
} from "@chakra-ui/react";
// assets
import closeIcon from "assets/icons/icon_close.png";
// types
import { AnyObject } from "types";
// utils
import { renderHtml } from "utils";

export const Modal = ({
  children,
  content,
  formId,
  handleSubmit,
  modalDisclosure,
  nestedForm = false,
  onConfirmHandler,
  submitButtonDisabled,
  submitting,
}: Props) => {
  const submitButtonProps: AnyObject = {};

  if (nestedForm) {
    submitButtonProps.onClick = handleSubmit;
  } else {
    submitButtonProps.form = formId;
  }

  return (
    <ChakraModal
      isOpen={modalDisclosure.isOpen}
      onClose={modalDisclosure.onClose}
      preserveScrollBarGap={true}
    >
      <ModalOverlay />
      <ModalContent sx={sx.modalContent}>
        <ModalHeader sx={sx.modalHeader}>
          <Heading as="h1" sx={sx.modalHeaderText}>
            {content.heading}
          </Heading>
        </ModalHeader>
        {content.subheading && (
          <Box sx={sx.modalSubheader}>{renderHtml(content.subheading)}</Box>
        )}
        <Flex sx={sx.modalCloseContainer}>
          <Button
            sx={sx.modalClose}
            leftIcon={<Image src={closeIcon} alt="Close" sx={sx.closeIcon} />}
            variant="transparent"
            onClick={modalDisclosure.onClose}
          >
            Close
          </Button>
        </Flex>
        <ModalBody sx={sx.modalBody}>{children}</ModalBody>
        {content.actionButtonText && (
          <ModalFooter sx={sx.modalFooter}>
            {formId && (
              <Button
                sx={sx.action}
                type="submit"
                data-testid="modal-submit-button"
                disabled={submitButtonDisabled}
                {...submitButtonProps}
              >
                {submitting ? <Spinner size="md" /> : content.actionButtonText}
              </Button>
            )}
            {onConfirmHandler && (
              <Button
                sx={sx.action}
                onClick={() => onConfirmHandler()}
                data-testid="modal-submit-button"
                disabled={submitButtonDisabled}
              >
                {submitting ? <Spinner size="md" /> : content.actionButtonText}
              </Button>
            )}
            <Button
              sx={sx.close}
              variant="transparent"
              onClick={modalDisclosure.onClose}
            >
              {content.closeButtonText}
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </ChakraModal>
  );
};

interface Props {
  children?: ReactNode;
  content: {
    heading: string;
    subheading?: string;
    actionButtonText: string | ReactNode;
    closeButtonText?: string;
  };
  formId?: string;
  handleSubmit?: Function;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
  nestedForm?: boolean;
  onConfirmHandler?: Function;
  submitting?: boolean;
  [key: string]: any;
}

const sx = {
  modalContent: {
    boxShadow: ".125rem .125rem .25rem",
    borderRadius: "0",
    maxWidth: "33rem",
    marginX: "4rem",
    padding: "spacer4",
  },
  modalHeader: {
    padding: "0",
  },
  modalHeaderText: {
    padding: "0 4rem 0 0",
    fontSize: "2xl",
    fontWeight: "bold",
  },
  modalSubheader: {
    margin: "0.5rem auto -1rem auto",
  },
  modalCloseContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexShrink: "0",
    position: "absolute",
    top: "spacer3",
    right: "spacer4",
  },
  modalClose: {
    span: {
      margin: "0 .25rem",
      svg: {
        fontSize: "xs",
        width: "xs",
        height: "xs",
      },
    },
  },
  modalBody: {
    paddingX: "0",
    paddingY: "spacer2",
  },
  modalFooter: {
    justifyContent: "flex-start",
    padding: "0",
    paddingTop: "spacer4",
  },
  action: {
    justifyContent: "center",
    marginTop: "spacer2",
    marginRight: "spacer4",
    minWidth: "10rem",
    span: {
      marginLeft: "spacer1",
      marginRight: "-0.25rem",
      "&.ds-c-spinner": {
        marginLeft: 0,
      },
    },
    ".mobile &": {
      fontSize: "sm",
    },
  },
  close: {
    justifyContent: "start",
    padding: "0.5rem 1rem",
    marginTop: "spacer2",
    span: {
      marginLeft: "0rem",
      marginRight: "spacer1",
    },
    ".mobile &": {
      fontSize: "sm",
      marginRight: "0",
    },
  },
  closeIcon: {
    width: "0.75rem",
  },
};
