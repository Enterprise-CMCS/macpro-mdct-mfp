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
import { AlertTypes, AnyObject, ReportStatus } from "types";
// utils
import { parseCustomHtml, useStore, utcDateToReadableDate } from "utils";
// verbiage
import WPVerbiage from "verbiage/pages/wp/wp-review-and-submit";
import SARVerbiage from "verbiage/pages/sar/sar-review-and-submit";
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
  const reportType =
    report?.reportType || localStorage.getItem("selectedReportType");
  const reportId = report?.id || localStorage.getItem("selectedReport");
  const reportState = state || localStorage.getItem("selectedState");

  const reportKeys = {
    reportType: reportType,
    state: reportState,
    id: reportId,
  };

  const reviewVerbiage = reportType === "WP" ? WPVerbiage : SARVerbiage;
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
            reviewVerbiage={reviewVerbiage}
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
  submittedBy?: string
) => {
  const fullReportType = reportType === "WP" ? "Work Plan" : "SAR";

  if (submissionDate && submittedBy) {
    const readableDate = utcDateToReadableDate(submissionDate, "full");
    const submittedDate = `was submitted on ${readableDate}`;
    const submittersName = `${submittedBy}`;

    const reportTitle = <b>{`${name}`}</b>;
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
      <Box>
        <Text sx={sx.additionalInfoHeader}>{intro.additionalInfoHeader}</Text>
        <Text sx={sx.additionalInfo}>
          {parseCustomHtml(intro.additionalInfo)}
        </Text>
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
  infoParagraph: {
    marginBottom: "1rem",
  },
  headerImage: {
    display: "inline-block",
    marginRight: "1rem",
    height: "27px",
  },
  list: {
    paddingLeft: "1rem",
    margin: "1.5rem",
    li: {
      marginBottom: "0.5rem",
    },
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
    marginRight: "2.5rem",
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
