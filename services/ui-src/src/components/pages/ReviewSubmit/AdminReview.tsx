import { MouseEventHandler } from "react";
import { Link as RouterLink } from "react-router-dom";
// components
import {
  Box,
  Button,
  Flex,
  Text,
  useDisclosure,
  Input,
  ModalFooter,
  Link,
} from "@chakra-ui/react";
import { Modal } from "components";
// utils
import { parseCustomHtml, useStore, releaseReport } from "utils";
// types
import { AnyObject, ReportStatus } from "types";

export const AdminReview = ({
  reviewVerbiage,
  submitForm,
  submitting,
}: AdminReviewProps) => {
  const { userIsAdmin } = useStore().user ?? {};
  const report = useStore().report;
  const { review } = reviewVerbiage;
  const { adminInfo } = review;
  const adminUnlockModal = useDisclosure();
  const adminApproveModal = useDisclosure();

  const reportKeys = {
    reportType: report!.reportType,
    state: report!.state,
    id: report!.id,
  };

  const unlockReport = async () => {
    adminUnlockModal.onOpen();
    await unlockReportHandler();
  };

  const unlockReportHandler = async () => {
    if (userIsAdmin) {
      await releaseReport(reportKeys);
    }
  };

  return (
    <Flex sx={sx.contentContainer} data-testid="ready-view">
      <Box sx={sx.adminLeadTextBox}>
        <Box sx={sx.infoTextBox}>
          <Text sx={sx.infoHeading}>{adminInfo.header}</Text>
          <Text>{parseCustomHtml(adminInfo.info)}</Text>
        </Box>
      </Box>
      <Flex sx={sx.adminSubmitContainer}>
        <Button
          type="submit"
          id="adminUnlock"
          onClick={unlockReport as MouseEventHandler}
          sx={sx.submitButton && sx.adminUnlockBtn}
          variant="outline"
          disabled={report?.status !== ReportStatus.SUBMITTED ? true : false}
        >
          {adminInfo.unlockLink.text}
        </Button>
        <Button
          type="submit"
          id="adminApprove"
          onClick={adminApproveModal.onOpen as MouseEventHandler}
          sx={sx.submitButton && sx.adminApproveBtn}
          disabled={report?.status !== ReportStatus.SUBMITTED ? true : false}
        >
          {adminInfo.submitLink.text}
        </Button>
      </Flex>
      <Modal
        onConfirmHandler={submitForm}
        submitting={submitting}
        modalDisclosure={{
          isOpen: adminUnlockModal.isOpen,
          onClose: adminUnlockModal.onClose,
        }}
        content={{
          heading: adminInfo.modal.unlockModal.heading,
          actionButtonText: "",
          closeButtonText: "",
        }}
      >
        <Text>{adminInfo.modal.unlockModal.body}</Text>
        <Link
          as={RouterLink}
          to={report?.formTemplate.basePath || "/"}
          variant="unstyled"
          tabIndex={-1}
          sx={sx.action}
        >
          <Button>{adminInfo.modal.unlockModal.actionButtonText}</Button>
        </Link>
      </Modal>
      <Modal
        onConfirmHandler={submitForm}
        submitting={submitting}
        modalDisclosure={{
          isOpen: adminApproveModal.isOpen,
          onClose: adminApproveModal.onClose,
        }}
        content={adminInfo.modal.approveModal}
      >
        <Text sx={sx.unlockModalBody}>{adminInfo.modal.approveModal.body}</Text>
        <Text fontWeight="bold">Enter APPROVE to confirm.</Text>
        <Input
          id="approve"
          name="approve"
          type="password"
          value={""}
          onChange={() => {}}
          className="field"
        />
        <ModalFooter sx={sx.modalFooter}>
          <Button
            type="submit"
            variant="outline"
            data-testid="modal-cancel-button"
            sx={sx.modalCancel}
            onClick={() => "cancel"}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={true}
            data-testid="modal-approve-button"
            onClick={() => "approve"}
          >
            Approve
          </Button>
        </ModalFooter>
      </Modal>
    </Flex>
  );
};

interface AdminReviewProps {
  submitForm: Function;
  submitting?: boolean;
  hasStarted?: boolean;
  isPermittedToSubmit?: boolean;
  reviewVerbiage: AnyObject;
}

const sx = {
  contentContainer: {
    flexDirection: "column",
    width: "100%",
    maxWidth: "reportPageWidth",
  },
  unlockModalBody: {
    marginBottom: "1rem",
  },
  adminLeadTextBox: {
    marginTop: "2rem",
    ul: {
      marginLeft: "2rem",
    },
  },
  infoTextBox: {
    marginTop: "2rem",
    a: {
      color: "palette.primary",
      textDecoration: "underline",
    },
  },
  infoHeading: {
    fontWeight: "bold",
    marginBottom: ".5rem",
  },
  adminApprove: {
    display: "flex",
  },
  adminSubmitContainer: {
    width: "100%",
    justifyContent: "start",
    marginTop: "2rem",
  },
  submitButton: {
    minHeight: "3rem",
    paddingRight: "1rem",
  },
  modalFooter: {
    paddingStart: 0,
    justifyContent: "start",
  },
  modalCancel: {
    marginRight: "1rem",
  },
  adminUnlockBtn: {
    marginRight: "1rem",
    "&:disabled": {
      opacity: 1,
      background: "white",
      color: "palette.gray_lighter",
      borderColor: "palette.gray_lighter",
    },
    "&disabled:hover": {
      opacity: 1,
      background: "white",
      color: "palette.gray_lighter",
    },
  },
  adminApproveBtn: {
    "&:disabled": {
      opacity: 1,
      background: "palette.gray_lighter",
      color: "palette.gray",
    },
  },
  action: {
    justifyContent: "center",
    marginTop: "1rem",
    marginRight: "2rem",
    minWidth: "10rem",
    span: {
      marginLeft: "0.5rem",
      marginRight: "-0.25rem",
      "&.ds-c-spinner": {
        marginLeft: 0,
      },
    },
    ".mobile &": {
      fontSize: "sm",
    },
  },
};
