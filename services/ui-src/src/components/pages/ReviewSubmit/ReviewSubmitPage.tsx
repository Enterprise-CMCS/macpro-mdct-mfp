import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
// components
import { Alert, Modal, StatusTable } from "components";
// types
import { AlertTypes, AnyObject, ReportStatus, ReportType } from "types";
// verbiage
import verbiage from "verbiage/pages/mfp/mfp-review-and-submit";
// assets
import checkIcon from "assets/icons/icon_check_circle.png";
import iconSearchDefault from "assets/icons/icon_search_blue.png";
import iconSearchSubmitted from "assets/icons/icon_search_white.png";
import { MouseEventHandler } from "react";
import { utcDateToReadableDate } from "utils";

export const ReviewSubmitPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // mock values
  const hasError = false;
  const { alertBox } = verbiage;

  return (
    <>
      {hasError && (
        <Box sx={sx.alert}>
          <Alert
            title={alertBox.title}
            status={AlertTypes.ERROR}
            description={alertBox.description}
          />
        </Box>
      )}
      <Flex sx={sx.pageContainer} data-testid="review-submit-page">
        {ReportStatus.SUBMITTED ? (
          <SuccessMessage
            reportType={ReportType.MFP}
            name="placeholder"
            date={Date.now()} // this is a placeholder date
            submittedBy={"placeholder"}
            reviewVerbiage={verbiage}
            stateName={"Puerto Rico"}
          />
        ) : (
          <ReadyToSubmit
            submitForm={() => {}}
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            submitting={false}
            isPermittedToSubmit={false}
            reviewVerbiage={{}}
          />
        )}
      </Flex>
    </>
  );
};

const PrintButton = ({ reviewVerbiage }: { reviewVerbiage: AnyObject }) => {
  const { print } = reviewVerbiage;
  const reportType = ReportType.MFP;
  const isSubmitted = false;
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

  return (
    <Flex sx={sx.contentContainer} data-testid="ready-view">
      <Box sx={sx.leadTextBox}>
        <Heading as="h1" sx={sx.headerText}>
          {intro.header}
        </Heading>
        <Box sx={sx.infoTextBox}>
          <Text sx={sx.infoHeading}>{intro.infoHeader}</Text>
          <Text>{intro.info}</Text>
        </Box>

        <Box>
          <StatusTable />
        </Box>
      </Box>
      <Flex sx={sx.submitContainer}>
        <PrintButton reviewVerbiage={reviewVerbiage} />
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
  if (submissionDate && submittedBy) {
    const readableDate = utcDateToReadableDate(submissionDate, "full");
    const submittedDate = `was submitted on ${readableDate}`;
    const submittersName = `${submittedBy}`;

    return `${reportType} report for ${name} ${submittedDate} by ${submittersName}.`;
  }
  return `${reportType} report for ${name} was submitted.`;
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
    marginTop: "2rem",
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
  alert: {
    marginBottom: "2rem",
  },
  submitButton: {
    minHeight: "3rem",
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
