// components
import { Box, Heading } from "@chakra-ui/react";
// utils
import { displayLongformPeriod, displayLongformPeriodSection9 } from "utils";
import { AnyObject } from "types";

export const ReportPeriod = ({ text, reportPeriod, reportYear }: Props) => {
  const { section, subsection } = text;
  const retSection = section === "Recruitment, Enrollment, and Transitions";
  const pageNine = subsection?.includes("HCBS");
  const currentPeriod = displayLongformPeriod(reportPeriod, reportYear);
  const currentPeriodSectionNine = displayLongformPeriodSection9(reportYear);
  return (
    <Box>
      {retSection &&
        (!pageNine ? (
          <Heading as="h2" sx={sx.periodText}>
            {currentPeriod}
          </Heading>
        ) : (
          <Heading as="h2" sx={sx.periodText}>
            {currentPeriodSectionNine}
          </Heading>
        ))}
    </Box>
  );
};

interface Props {
  text: AnyObject;
  [key: string]: any;
  reportPeriod?: number;
  reportYear?: number;
}

const sx = {
  periodText: {
    marginTop: "spacer3",
    fontSize: "2xl",
  },
};
