// components
import { Box, Heading } from "@chakra-ui/react";
import { InstructionsAccordion } from "components";
// utils
import { parseCustomHtml } from "utils";
import { AnyObject, OverlayModalStepTypes } from "types";
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

  if (section && (subsection || initiativeName)) {
    return (
      <Box sx={sx.introBox} {...props}>
        <Heading as="h1" sx={sx.smallHeading}>
          {section}
        </Heading>
        <Heading as="h2" sx={sx.largeHeading}>
          {initiativeName ? initiativeName : subsection}
        </Heading>
        {hint && <Box sx={sx.hintTextBox}>{parseCustomHtml(hint)}</Box>}
        {accordion && !OverlayModalStepTypes.OBJECTIVE_PROGRESS && (
          <InstructionsAccordion verbiage={accordion} />
        )}
        {OverlayModalStepTypes.OBJECTIVE_PROGRESS && text.dashboardTitle && (
          <Heading as="h3" sx={sx.subTitle}>
            {text.dashboardTitle}
          </Heading>
        )}
        {info && <Box sx={sx.infoTextBox}>{parseCustomHtml(info)}</Box>}
        {accordion && OverlayModalStepTypes.OBJECTIVE_PROGRESS && (
          <InstructionsAccordion verbiage={accordion} />
        )}
        <ReportPeriod
          text={text}
          reportPeriod={reportPeriod}
          reportYear={reportYear}
        />
      </Box>
    );
  }

  return (
    <Box sx={sx.introBox} {...props}>
      <Heading as="h1" sx={sx.largeHeading}>
        {subsection}
      </Heading>
      {hint && <Box sx={sx.hintTextBox}>{parseCustomHtml(hint)}</Box>}
      {accordion && !OverlayModalStepTypes.OBJECTIVE_PROGRESS && (
        <InstructionsAccordion verbiage={accordion} />
      )}
      {OverlayModalStepTypes.OBJECTIVE_PROGRESS && text.dashboardTitle && (
        <Heading as="h3" sx={sx.subTitle}>
          {text.dashboardTitle}
        </Heading>
      )}
      {info && <Box sx={sx.infoTextBox}>{parseCustomHtml(info)}</Box>}
      {accordion && OverlayModalStepTypes.OBJECTIVE_PROGRESS && (
        <InstructionsAccordion verbiage={accordion} />
      )}
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
  smallHeading: {
    color: "palette.gray",
    fontSize: "md",
  },
  largeHeading: {
    fontWeight: "normal",
    fontSize: "4xl",
    marginTop: "0.5rem",
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
    color: "palette.gray",
    li: {
      paddingBottom: "1.5rem",
    },
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
