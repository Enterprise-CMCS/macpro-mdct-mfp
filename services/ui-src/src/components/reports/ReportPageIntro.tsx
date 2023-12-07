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
  const { section, subsection, hint, info } = text;

  return (
    <Box sx={sx.introBox} {...props}>
      <Heading as="h1" sx={sx.sectionHeading}>
        {section}
      </Heading>
      <Heading as="h2" sx={sx.subsectionHeading}>
        {initiativeName ? initiativeName : subsection}
      </Heading>
      {hint && <Box sx={sx.hintTextBox}>{hint}</Box>}
      {accordion && <InstructionsAccordion verbiage={accordion} />}
      {info && <Box sx={sx.infoTextBox}>{parseCustomHtml(info)}</Box>}
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
  },
  sectionHeading: {
    color: "palette.gray",
    fontSize: "md",
  },
  subsectionHeading: {
    fontWeight: "normal",
    fontSize: "4xl",
    marginTop: "0.5rem",
  },
  hintTextBox: {
    color: "#5B616B",
    paddingTop: "1.5rem",
  },
  infoTextBox: {
    marginTop: "1.5rem",
    color: "palette.gray",
    h3: {
      marginBottom: "-0.75rem",
    },
    "p, span": {
      color: "palette.gray",
      marginTop: "1rem",
    },
    a: {
      color: "palette.primary",
      "&:hover": {
        color: "palette.primary_darker",
      },
    },
    b: {
      color: "palette.base",
    },
  },
  periodText: {
    marginTop: "1.5rem",
    fontSize: "2xl",
  },
};
