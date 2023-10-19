// components
import { Box, Heading } from "@chakra-ui/react";
import { InstructionsAccordion } from "components";
// utils
import { displayLongformPeriod, parseCustomHtml } from "utils";
import { AnyObject } from "types";

export const ReportPageIntro = ({
  text,
  accordion,
  initiativeName,
  reportPeriod,
  ...props
}: Props) => {
  const { section, subsection, hint, info } = text;
  const retSection = section === "Recruitment, Enrollment, and Transitions";
  const pageNine = subsection.includes("HCBS");
  const currentPeriod = displayLongformPeriod(reportPeriod);
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
      {retSection &&
        (!pageNine ? (
          <Heading as="h2" sx={sx.periodText}>
            {currentPeriod}
          </Heading>
        ) : (
          <Heading as="h2" sx={sx.periodText}>
            This page needs a different calculation
          </Heading>
        ))}
    </Box>
  );
};

interface Props {
  text: AnyObject;
  accordion?: AnyObject;
  initiativeName?: string;
  [key: string]: any;
  reportPeriod?: number;
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
  },
  hintTextBox: {
    color: "#5B616B",
    paddingTop: "1.5rem",
  },
  infoTextBox: {
    marginTop: "2rem",
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
