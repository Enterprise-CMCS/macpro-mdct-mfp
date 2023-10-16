import { MouseEventHandler, useContext, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
// components
import {
  Box,
  Button,
  Flex,
  Image,
  Heading,
  Text,
  useDisclosure,
  Input,
  ModalFooter,
} from "@chakra-ui/react";
import { Alert, Modal, ReportContext, StatusTable } from "components";
// types
import { AlertTypes, AnyObject, ReportStatus } from "types";
// utils
import { parseCustomHtml, useStore, utcDateToReadableDate } from "utils";
// verbiage
import verbiage from "verbiage/pages/mfp/mfp-review-and-submit";
// assets
import checkIcon from "assets/icons/icon_check_circle.png";
import iconSearchDefault from "assets/icons/icon_search_blue.png";
import iconSearchSubmitted from "assets/icons/icon_search_white.png";

export const ReviewSubmitPage = () => {
  const { fetchReport, submitReport } = useContext(ReportContext);
  const report = useStore().report;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isPermittedToSubmit, setIsPermittedToSubmit] =
    useState<boolean>(false);

  // get user information
  const { state, userIsEndUser, userIsAdmin } = useStore().user ?? {};

  // get report type, state, and id from context or storage
  const reportType =
    report?.reportType || localStorage.getItem("selectedReportType");
  const reportId = report?.id || localStorage.getItem("selectedReport");
  const reportState = state || localStorage.getItem("selectedState");

  const reportKeys = {
    reportType: reportType,
    state: reportState,
    id: reportId,
  };

  const reviewVerbiage = verbiage;

  const { alertBox } = reviewVerbiage;

  useEffect(() => {
    if (report?.id) {
      fetchReport(reportKeys);
    }
  }, []);

  useEffect(() => {
    setHasError(!!document.querySelector("img[alt='Error notification']"));
  }, [fetchReport]);

  useEffect(() => {
    setIsPermittedToSubmit(
      (userIsEndUser &&
        report?.status === ReportStatus.IN_PROGRESS &&
        !hasError) ||
        false
    );
  }, [userIsEndUser, report?.status, hasError]);

  const submitForm = async () => {
    setSubmitting(true);
    if (isPermittedToSubmit) {
      await submitReport(reportKeys);
    }
    await fetchReport(reportKeys);
    setSubmitting(false);
    onClose();
  };

  return (
    <>
      {(hasError || report?.status === ReportStatus.NOT_STARTED) && (
        <Box sx={sx.alert}>
          <Alert
            title={alertBox.title}
            status={AlertTypes.ERROR}
            description={alertBox.description}
          />
        </Box>
      )}
      <Flex sx={sx.pageContainer} data-testid="review-submit-page">
        {report?.status == ReportStatus.SUBMITTED ? (
          <SuccessMessage
            reportType={report.reportType}
            name={report.submissionName}
            date={report?.submittedOnDate}
            submittedBy={report?.submittedBy}
            reviewVerbiage={reviewVerbiage}
            stateName={report.fieldData.stateName!}
          />
        ) : (
          <div>
            <ReadyToSubmit
              submitForm={submitForm}
              isOpen={isOpen}
              onOpen={onOpen}
              onClose={onClose}
              submitting={submitting}
              isPermittedToSubmit={isPermittedToSubmit}
              reviewVerbiage={reviewVerbiage}
            />
            {userIsAdmin && (
              <AdminReview
                submitForm={submitForm}
                submitting={submitting}
                isPermittedToSubmit={isPermittedToSubmit}
                reviewVerbiage={reviewVerbiage}
              />
            )}
          </div>
        )}
      </Flex>
    </>
  );
};

const PrintButton = ({ reviewVerbiage }: { reviewVerbiage: AnyObject }) => {
  const { print } = reviewVerbiage;
  const report = useStore().report;
  const reportType = report?.reportType === "WP" ? "wp" : "sar";

  const isSubmitted = report?.status === "Submitted";
  return (
    <Button
      as={RouterLink}
      to={`/${reportType}/export`}
      target="_blank"
      sx={!isSubmitted ? sx.printButton : sx.downloadButton}
      leftIcon={
        !isSubmitted ? (
          <Image src={iconSearchDefault} alt="Search Icon" height=".9rem" />
        ) : (
          <Image src={iconSearchSubmitted} alt="Search Icon" height=".9rem" />
        )
      }
      variant={!isSubmitted ? "outline" : "primary"}
    >
      {print.printButtonText}
    </Button>
  );
};

const ReadyToSubmit = ({
  submitForm,
  isOpen,
  onOpen,
  onClose,
  submitting,
  isPermittedToSubmit,
  reviewVerbiage,
}: ReadyToSubmitProps) => {
  const { review } = reviewVerbiage;
  const { intro, modal, pageLink } = review;
  const pdfExport = true;

  return (
    <Flex sx={sx.contentContainer} data-testid="ready-view">
      <Box sx={sx.leadTextBox}>
        <Heading as="h1" sx={sx.headerText}>
          {intro.header}
        </Heading>
        <Box sx={sx.infoTextBox}>
          <Text sx={sx.infoHeading}>{intro.infoHeader}</Text>
          <Text>{parseCustomHtml(intro.info)}</Text>
        </Box>

        <Box>
          <StatusTable />
        </Box>
      </Box>
      <Flex sx={sx.submitContainer}>
        {pdfExport && <PrintButton reviewVerbiage={reviewVerbiage} />}
        <Button
          type="submit"
          onClick={onOpen as MouseEventHandler}
          isDisabled={!isPermittedToSubmit}
          sx={sx.submitButton}
        >
          {pageLink.text}
        </Button>
      </Flex>
      <Modal
        onConfirmHandler={submitForm}
        submitting={submitting}
        modalDisclosure={{
          isOpen,
          onClose,
        }}
        content={modal.structure}
      >
        <Text>{modal.body}</Text>
      </Modal>
    </Flex>
  );
};

const AdminReview = ({
  reviewVerbiage,
  submitForm,
  submitting,
}: AdminReviewProps) => {
  const { review } = reviewVerbiage;
  const { adminInfo } = review;
  const adminModal1 = useDisclosure();
  const adminModal2 = useDisclosure();

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
          onClick={adminModal1.onOpen as MouseEventHandler}
          sx={sx.submitButton && sx.adminReviewButtons}
          variant="outline"
        >
          {adminInfo.unlockLink.text}
        </Button>
        <Button
          type="submit"
          id="adminApprove"
          onClick={adminModal2.onOpen as MouseEventHandler}
          sx={sx.submitButton && sx.adminApprove}
        >
          {adminInfo.submitLink.text}
        </Button>
      </Flex>
      <Modal
        onConfirmHandler={submitForm}
        submitting={submitting}
        modalDisclosure={{
          isOpen: adminModal1.isOpen,
          onClose: adminModal1.onClose,
        }}
        content={{
          heading: adminInfo.modal.unlockModal.heading,
          actionButtonText: adminInfo.modal.unlockModal.actionButtonText,
          closeButtonText: adminInfo.modal.unlockModal.closeButtonText,
        }}
      >
        <Text>{adminInfo.modal.unlockModal.body}</Text>
      </Modal>
      <Modal
        onConfirmHandler={submitForm}
        submitting={submitting}
        modalDisclosure={{
          isOpen: adminModal2.isOpen,
          onClose: adminModal2.onClose,
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
            data-testid="modal-logout-button"
            sx={sx.modalCancel}
          >
            Cancel
          </Button>
          <Button type="submit" data-testid="modal-refresh-button">
            Approve
          </Button>
        </ModalFooter>
      </Modal>
    </Flex>
  );
};

interface ReadyToSubmitProps {
  submitForm: Function;
  isOpen: boolean;
  onOpen: Function;
  onClose: Function;
  submitting?: boolean;
  hasStarted?: boolean;
  isPermittedToSubmit?: boolean;
  reviewVerbiage: AnyObject;
}

interface AdminReviewProps {
  submitForm: Function;
  submitting?: boolean;
  hasStarted?: boolean;
  isPermittedToSubmit?: boolean;
  reviewVerbiage: AnyObject;
}

export const SuccessMessageGenerator = (
  reportType: string,
  name: string,
  submissionDate?: number,
  submittedBy?: string,
  stateName?: string
) => {
  if (submissionDate && submittedBy) {
    const readableDate = utcDateToReadableDate(submissionDate, "full");
    const submittedDate = `was submitted on ${readableDate}`;
    const submittersName = `${submittedBy}`;

    const reportTitle = <b>{`${stateName} ${name}`}</b>;
    const preSubmissionMessage = `${reportType} submission for `;
    const postSubmissionMessage = ` ${submittedDate} by ${submittersName}.`;
    return [preSubmissionMessage, reportTitle, postSubmissionMessage];
  }
  return `${reportType} report for ${name} was submitted.`;
};

export const SuccessMessage = ({
  reportType,
  name,
  date,
  submittedBy,
  reviewVerbiage,
  stateName,
}: SuccessMessageProps) => {
  const { submitted } = reviewVerbiage;
  const { intro } = submitted;
  const submissionMessage = SuccessMessageGenerator(
    reportType,
    name,
    date,
    submittedBy,
    stateName
  );
  return (
    <Flex sx={sx.contentContainer}>
      <Box sx={sx.leadTextBox}>
        <Heading as="h1" sx={sx.headerText}>
          <span>
            <Image src={checkIcon} alt="Checkmark Icon" sx={sx.headerImage} />
          </span>
          {intro.header}
        </Heading>
        <Box sx={sx.infoTextBox}>
          <Text sx={sx.infoHeading}>{intro.infoHeader}</Text>
          <Text>{submissionMessage}</Text>
        </Box>
      </Box>
      <Box>
        <Text sx={sx.additionalInfoHeader}>{intro.additionalInfoHeader}</Text>
        <Text sx={sx.additionalInfo}>{intro.additionalInfo}</Text>
      </Box>

      <Box sx={sx.infoTextBox}>
        <PrintButton reviewVerbiage={reviewVerbiage} />
      </Box>
    </Flex>
  );
};

interface SuccessMessageProps {
  reportType: string;
  name: string;
  reviewVerbiage: AnyObject;
  date?: number;
  submittedBy?: string;
  stateName?: string;
}

const sx = {
  pageContainer: {
    height: "100%",
    width: "100%",
  },
  contentContainer: {
    flexDirection: "column",
    width: "100%",
    maxWidth: "reportPageWidth",
  },
  leadTextBox: {
    width: "100%",
    paddingBottom: ".5rem",
    marginBottom: "1.5rem",
    borderBottom: "1px solid",
    borderColor: "palette.gray_light",
  },
  headerText: {
    marginBottom: "1rem",
    fontSize: "4xl",
    fontWeight: "normal",
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
  headerImage: {
    display: "inline-block",
    marginRight: "1rem",
    height: "27px",
  },
  additionalInfoHeader: {
    color: "palette.gray",
    fontWeight: "bold",
    marginBottom: ".5rem",
  },
  additionalInfo: {
    color: "palette.gray",
  },
  adminApprove: {
    display: "flex",
  },
  printButton: {
    minWidth: "6rem",
    height: "2rem",
    fontSize: "md",
    fontWeight: "700",
    border: "1px solid",
  },
  downloadButton: {
    minWidth: "6rem",
    height: "2rem",
    fontSize: "md",
    fontWeight: "700",
    color: "white !important",
    textDecoration: "none !important",
    "&:hover, &:focus": {
      backgroundColor: "palette.primary",
      color: "white",
    },
  },
  submitContainer: {
    width: "100%",
    justifyContent: "space-between",
  },
  adminSubmitContainer: {
    width: "100%",
    justifyContent: "start",
    marginTop: "2rem",
  },
  alert: {
    marginBottom: "2rem",
  },
  submitButton: {
    minHeight: "3rem",
    paddingRight: "1rem",
    "&:disabled": {
      opacity: 1,
      background: "palette.gray_lighter",
      color: "palette.gray",
      "&:hover": {
        background: "palette.gray_lighter",
      },
    },
  },
  modalFooter: {
    paddingStart: 0,
    justifyContent: "start",
  },
  modalCancel: {
    marginRight: "1rem",
  },
  adminReviewButtons: {
    marginRight: "1rem",
  },
};
