// components
import { Box, Heading } from "@chakra-ui/react";
import { InstructionsAccordion } from "components";
import { ReportPeriod } from "./ReportPeriod";
// types
import { AnyObject } from "types";
// utils
import { parseCustomHtml } from "utils";

export const ReportPageIntro = ({
  text,
  accordion,
  initiativeName,
  reportPeriod,
  reportYear,
}: Props) => {
  const { section, subsection, info, introAccordion } = text;

  const isSubsectionPage = section && (subsection || initiativeName);

  const header = () => {
    return (
      <Heading as="h1" sx={sx.largeHeading}>
        {subsection}
      </Heading>
    );
  };

  const headerSubsection = () => {
    return (
      <>
        <Heading as="h1" sx={sx.smallHeading}>
          {section}
        </Heading>
        <Heading as="h2" sx={sx.largeHeading}>
          {initiativeName ?? subsection}
        </Heading>
      </>
    );
  };

  return (
    <Box sx={sx.introBox}>
      {isSubsectionPage ? headerSubsection() : header()}

      {/* accordion specifically nested in the intro verbiage */}
      {introAccordion && <InstructionsAccordion verbiage={introAccordion} />}

      {info && <Box sx={sx.infoTextBox}>{parseCustomHtml(info)}</Box>}

      {accordion && <InstructionsAccordion verbiage={accordion} />}

      {/* SAR Reporting Period section */}
      <ReportPeriod
        text={text}
        reportPeriod={reportPeriod}
        reportYear={reportYear}
      />
    </Box>
  );
};

interface Props {
  text: AnyObject;
  accordion?: AnyObject;
  initiativeName?: string;
  reportPeriod?: number;
  reportYear?: number;
}

const sx = {
  introBox: {
    marginBottom: "spacer2",

    p: {
      marginBottom: "spacer2",
      marginTop: "0",
    },
    ".mdct-table th": {
      textTransform: "capitalize",
      fontSize: "sm",
      fontWeight: "600",
      color: "gray",
      borderColor: "gray_lighter",
    },
    ".mdct-smalltext": {
      fontSize: "xs",
      marginTop: "0.625rem",
      color: "gray",
    },
  },
  smallHeading: {
    color: "gray",
    fontSize: "md",
  },
  largeHeading: {
    fontWeight: "normal",
    fontSize: "4xl",
    marginTop: "spacer1",
  },
  infoTextBox: {
    color: "gray_dark",
    marginTop: "spacer2",
    h3: {
      marginBottom: "-0.75rem",
    },
    a: {
      color: "primary",
      "&:hover": {
        color: "primary_darker",
      },
    },
  },
};
