// components
import { Box, Heading } from "@chakra-ui/react";
import { InstructionsAccordion } from "components";
// utils
import {
  calculateLongformPeriod,
  convertDateUtcToEt,
  parseCustomHtml,
} from "utils";
import { AnyObject, ReportType } from "types";

export const ReportPageIntro = ({
  text,
  accordion,
  initiativeName,
  reportType,
  ...props
}: Props) => {
  const { section, subsection, hint, info } = text;
  const currentDate = Date.now();
  const isSAR = reportType === ReportType.SAR;
  const date = new Date(convertDateUtcToEt(currentDate));
  const currentPeriod = calculateLongformPeriod(date);
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
      {info && isSAR && (
        <Heading as="h2" sx={sx.periodText}>
          {currentPeriod} reporting period
        </Heading>
      )}
    </Box>
  );
};

interface Props {
  text: AnyObject;
  accordion?: AnyObject;
  initiativeName?: string;
  [key: string]: any;
  reportType?: string;
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
