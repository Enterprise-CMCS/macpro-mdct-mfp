import React, {
  MouseEventHandler,
  useContext,
  useEffect,
  useState,
} from "react";
import { AdminReview } from "./AdminReview";
// components
import {
  Box,
  Button,
  Flex,
  ListItem,
  Image,
  Heading,
  Text,
  useDisclosure,
  UnorderedList,
} from "@chakra-ui/react";
import {
  Alert,
  Modal,
  PrintButton,
  ReportContext,
  StatusTable,
} from "components";
// types
import { AlertTypes, AnyObject, ReportStatus, ReportType } from "types";
// utils
import {
  getReportVerbiage,
  parseCustomHtml,
  useStore,
  utcDateToReadableDate,
} from "utils";
// assets
import checkIcon from "assets/icons/icon_check_circle.png";

export const ReviewSubmitPage = () => {
  const { fetchReport, submitReport } = useContext(ReportContext);
  const { report, setEditable } = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isPermittedToSubmit, setIsPermittedToSubmit] =
    useState<boolean>(false);

  const { state, userIsEndUser, userIsAdmin } = useStore().user ?? {};

  // get report type, state, and id from context or storage
  const reportType = (report?.reportType ||
    localStorage.getItem("selectedReportType")) as ReportType;
  const reportId = report?.id || localStorage.getItem("selectedReport");
  const reportState = state || localStorage.getItem("selectedState");

  const reportKeys = {
    reportType: reportType,
    state: reportState,
    id: reportId,
  };

  const { reviewAndSubmitVerbiage } = getReportVerbiage(reportType);
  const { alertBox } = reviewAndSubmitVerbiage;

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
        (report?.status === ReportStatus.IN_REVISION && !hasError) ||
        false
    );
  }, [userIsEndUser, report?.status, hasError]);

  const submitForm = async () => {
    setSubmitting(true);
    if (isPermittedToSubmit) {
      await submitReport(reportKeys)?.then(() => {
        setEditable(false);
      });
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
            reviewVerbiage={reviewAndSubmitVerbiage}
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
              reviewVerbiage={reviewAndSubmitVerbiage}
            />
            {userIsAdmin && (
              <AdminReview
                submitForm={submitForm}
                submitting={submitting}
                isPermittedToSubmit={isPermittedToSubmit}
                reviewVerbiage={reviewAndSubmitVerbiage}
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
          {intro.info.map((item: any, index: number) => (
            <React.Fragment key={index}>
              {item.sectionHeader && (
                <Text sx={sx.infoHeading}>{item.sectionHeader}</Text>
              )}
              <Text sx={sx.infoParagraph}>{item.content}</Text>
            </React.Fragment>
          ))}
        </Box>

        <Box>
          <StatusTable />
        </Box>
      </Box>
      <Flex sx={sx.footerBox}>
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
  submittedBy?: string
) => {
  const fullReportType =
    reportType === "WP"
      ? "Work Plan"
      : reportType === "SAR"
        ? "SAR"
        : "Expenditure Report";

  if (submissionDate && submittedBy) {
    const readableDate = utcDateToReadableDate(submissionDate, "full");
    const submittedDate = `was submitted on ${readableDate}`;
    const submittersName = `${submittedBy}`;

    const reportTitle =
      reportType !== ReportType.EXPENDITURE ? <b>{`${name}`}</b> : "state";
    const preSubmissionMessage = `MFP ${fullReportType} submission for `;
    const postSubmissionMessage = ` ${submittedDate} by ${submittersName}.`;
    return [preSubmissionMessage, reportTitle, postSubmissionMessage];
  }
  return `${fullReportType} report for ${name} was submitted.`;
};

export const SuccessMessage = ({
  reportType,
  name,
  date,
  submittedBy,
  reviewVerbiage,
}: SuccessMessageProps) => {
  const { submitted } = reviewVerbiage;
  const { intro } = submitted;
  const submissionMessage = SuccessMessageGenerator(
    reportType,
    name,
    date,
    submittedBy
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
      <Box sx={sx.additionalInfo}>
        <Text sx={sx.additionalInfoHeader}>{intro.additionalInfoHeader}</Text>
        {parseCustomHtml(intro.additionalInfo)}
        {intro.list && (
          <UnorderedList sx={sx.list}>
            {intro.list.map((item: any, index: number) => {
              return (
                <ListItem key={index}>
                  {parseCustomHtml(item.content)}
                  {item.children && (
                    <UnorderedList sx={sx.list} key={index}>
                      {item.children.map((child: any, index: number) => {
                        return (
                          <ListItem key={index}>
                            {parseCustomHtml(child.content)}
                          </ListItem>
                        );
                      })}
                    </UnorderedList>
                  )}
                </ListItem>
              );
            })}
          </UnorderedList>
        )}
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
    table: {
      marginBottom: "0",
    },
  },
  headerText: {
    marginBottom: "spacer2",
    fontSize: "4xl",
    fontWeight: "normal",
  },
  infoTextBox: {
    marginTop: "spacer4",
    a: {
      color: "primary",
      textDecoration: "underline",
    },
  },
  infoHeading: {
    fontWeight: "bold",
    marginBottom: "spacer1",
  },
  infoParagraph: {
    marginBottom: "spacer2",
  },
  headerImage: {
    display: "inline-block",
    marginRight: "spacer2",
    height: "27px",
  },
  list: {
    color: "gray",
    paddingLeft: "spacer2",
    margin: "spacer_half",
  },
  additionalInfoHeader: {
    color: "gray",
    fontWeight: "bold",
  },
  additionalInfo: {
    paddingTop: "spacer3",
    marginTop: "spacer1",
    borderTop: "1px solid",
    borderColor: "gray_light",
    p: {
      color: "gray",
    },
    "p + p": {
      marginY: "spacer1",
    },
  },
  alert: {
    marginBottom: "spacer4",
    marginRight: "spacer5",
  },
  footerBox: {
    marginTop: "spacer5",
    paddingTop: "spacer3",
    borderTop: "1px solid",
    borderColor: "gray_light",
    flexDirection: {
      base: "column",
      sm: "row",
    },
  },
  submitButton: {
    minHeight: "3rem",
    paddingRight: "spacer2",
    marginTop: {
      base: "1.5rem",
      sm: "0",
    },
    marginLeft: {
      sm: "auto",
    },
    "&:disabled": {
      opacity: 1,
      background: "gray_lighter",
      color: "gray",
      "&:hover": {
        background: "gray_lighter",
      },
    },
  },
};
