// components
import { Box, Heading } from "@chakra-ui/react";
import { InstructionsAccordion } from "components";
// utils
import { parseCustomHtml } from "utils";
import { AnyObject } from "types";
import { ReportPeriod } from "./ReportPeriod";

export const ReportPageIntro = ({
  text,
  accordion,
  initiativeName,
  reportPeriod,
  reportYear,
  ...props
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
    <Box sx={sx.introBox} {...props}>
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
  [key: string]: any;
  reportPeriod?: number;
  reportYear?: number;
}

const sx = {
  introBox: {
    marginBottom: "1rem",

    p: {
      marginBottom: "1rem",
      marginTop: "0",
    },
    ".mdct-table th": {
      textTransform: "capitalize",
      fontSize: "sm",
      fontWeight: "600",
      color: "palette.gray",
    },
    ".mdct-smalltext": {
      fontSize: "xs",
      marginTop: "0.625rem",
      color: "palette.gray",
    },
  },
  smallHeading: {
    color: "palette.gray",
    fontSize: "md",
  },
  largeHeading: {
    fontWeight: "normal",
    fontSize: "4xl",
    marginTop: "spacer1",
  },
  hintTextBox: {
    color: "#5B616B",
    paddingTop: "1.5rem",
  },
  subTitle: {
    color: "palette.gray",
    fontSize: "md",
    margin: "1.5rem 0 -0.75rem 0",
  },
  infoTextBox: {
    marginTop: "1rem",
    h3: {
      marginBottom: "-0.75rem",
    },
    a: {
      color: "palette.primary",
      "&:hover": {
        color: "palette.primary_darker",
      },
    },
  },
  periodText: {
    marginTop: "1.5rem",
    fontSize: "2xl",
  },
};
