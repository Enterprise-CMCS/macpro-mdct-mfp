import { MouseEventHandler, useContext, useEffect, useState } from "react";
import { AdminReview } from "./AdminReview";
// components
import {
  Box,
  Button,
  Flex,
  Image,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  Alert,
  Modal,
  PrintButton,
  ReportContext,
  StatusTable,
} from "components";
// types
import { AlertTypes, AnyObject, ReportStatus } from "types";
// utils
import { parseCustomHtml, useStore, utcDateToReadableDate } from "utils";
// verbiage
import verbiage from "verbiage/pages/mfp/mfp-review-and-submit";
// assets
import checkIcon from "assets/icons/icon_check_circle.png";

export const ReviewSubmitPage = () => {
  const { fetchReport, submitReport } = useContext(ReportContext);
  const report = useStore().report;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isPermittedToSubmit, setIsPermittedToSubmit] =
    useState<boolean>(false);

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
        {report?.status == ReportStatus.SUBMITTED && userIsEndUser ? (
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

const ReadyToSubmit = ({
  submitForm,
  isOpen,
  onOpen,
  onClose,
  submitting,
  isPermittedToSubmit,
  reviewVerbiage,
}: ReadyToSubmitProps) => {
  const { userIsAdmin } = useStore().user ?? {};
  const { review } = reviewVerbiage;
  const { intro, modal, pageLink } = review;

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
        <PrintButton />
        {!userIsAdmin && (
          <Button
            type="submit"
            onClick={onOpen as MouseEventHandler}
            isDisabled={!isPermittedToSubmit}
            sx={sx.submitButton}
          >
            {pageLink.text}
          </Button>
        )}
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
        <PrintButton />
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
  submitContainer: {
    width: "100%",
    justifyContent: "space-between",
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
};
