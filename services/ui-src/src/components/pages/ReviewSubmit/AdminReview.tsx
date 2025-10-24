import { MouseEventHandler, useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
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
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { Modal } from "components";
// utils
import { parseCustomHtml, useStore, releaseReport, approveReport } from "utils";
// types
import { AnyObject, ReportStatus, ReportType } from "types";

export const AdminReview = ({
  reviewVerbiage,
  submitForm,
  submitting,
}: AdminReviewProps) => {
  // approve input state
  const [approveInput, setApproveInput] = useState<string>("");
  const [isApproved, setIsApproved] = useState<boolean>(false);

  //

  const { userIsAdmin } = useStore().user ?? {};
  const report = useStore().report;
  const { review } = reviewVerbiage;
  const { adminInfo } = review;

  // admin modals
  const adminUnlockModal = useDisclosure();
  const adminApproveModal = useDisclosure();
  const navigate = useNavigate();

  const reportKeys = {
    reportType: report!.reportType,
    state: report!.state,
    id: report!.id,
  };

  const unlockReport = async () => {
    adminUnlockModal.onOpen();
    await unlockReportHandler();
  };

  const refreshStatus = () => {
    adminUnlockModal.onClose();
    return navigate(0);
  };

  const unlockReportHandler = async () => {
    if (userIsAdmin) {
      await releaseReport(reportKeys);
    }
  };

  const handleInputVerification = (e: any) => {
    setApproveInput(e.target.value);
  };

  const handleSubmitApproval = async () => {
    await approveReport(reportKeys, report!);
    await navigate(report?.formTemplate?.basePath || "/");
  };

  useEffect(() => {
    const approved = /^\bAPPROVE$\b|^\bApprove$\b|^\bapprove$\b/;
    approved.test(approveInput) ? setIsApproved(true) : setIsApproved(false);
  }, [approveInput]);

  return (
    <Flex sx={sx.contentContainer} data-testid="ready-view">
      <Box sx={sx.adminLeadTextBox}>
        <Box sx={sx.infoTextBox}>
          <Text sx={sx.infoHeading}>{adminInfo.header}</Text>
          {adminInfo.list && (
            <UnorderedList sx={sx.list}>
              {adminInfo.list.map((item: any, index: number) => (
                <ListItem key={index}>{parseCustomHtml(item.content)}</ListItem>
              ))}
            </UnorderedList>
          )}
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
        {report!.reportType === ReportType.WP && (
          <Button
            type="submit"
            id="adminApprove"
            onClick={adminApproveModal.onOpen as MouseEventHandler}
            sx={sx.submitButton && sx.adminApproveBtn}
            disabled={report?.status !== ReportStatus.SUBMITTED ? true : false}
          >
            {adminInfo.submitLink.text}
          </Button>
        )}
      </Flex>
      <Modal
        onConfirmHandler={submitForm}
        submitting={submitting}
        modalDisclosure={{
          isOpen: adminUnlockModal.isOpen,
          onClose: refreshStatus,
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
          to={report?.formTemplate?.basePath || "/"}
          variant="unstyled"
          tabIndex={-1}
          sx={sx.action}
        >
          <Button sx={sx.unlockModalButton}>
            {adminInfo.modal.unlockModal.actionButtonText}
          </Button>
        </Link>
      </Modal>
      {report!.reportType === ReportType.WP && (
        <Modal
          onConfirmHandler={submitForm}
          submitting={submitting}
          modalDisclosure={{
            isOpen: adminApproveModal.isOpen,
            onClose: adminApproveModal.onClose,
          }}
          content={adminInfo.modal.approveModal}
        >
          <Text sx={sx.unlockModalBody}>
            {adminInfo.modal.approveModal.body}
          </Text>
          <Text fontWeight="bold">Enter APPROVE to confirm.</Text>
          <Input
            id="approve"
            name="approve"
            type="text"
            value={approveInput}
            onChange={handleInputVerification}
            className="field"
          />
          <ModalFooter sx={sx.modalFooter}>
            <Button
              type="submit"
              variant="outline"
              data-testid="modal-cancel-button"
              sx={sx.modalCancel}
              onClick={() => adminApproveModal.onClose()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isApproved ? false : true}
              data-testid="modal-approve-button"
              onClick={handleSubmitApproval}
            >
              Approve
            </Button>
          </ModalFooter>
        </Modal>
      )}
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
    marginBottom: "spacer2",
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
  list: {
    paddingLeft: "spacer2",
    margin: "spacer3",
    li: {
      marginBottom: "spacer1",
    },
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
    paddingRight: "spacer2",
  },
  modalFooter: {
    paddingStart: 0,
    justifyContent: "start",
  },
  modalCancel: {
    marginRight: "spacer2",
  },
  unlockModalButton: {
    marginTop: "spacer2",
  },
  adminUnlockBtn: {
    marginRight: "spacer2",
    "&disabled": {
      opacity: 1,
      background: "white",
      color: "palette.gray_lighter",
      borderColor: "palette.gray_lighter",
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
    marginTop: "spacer2",
    marginRight: "2rem",
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
};
