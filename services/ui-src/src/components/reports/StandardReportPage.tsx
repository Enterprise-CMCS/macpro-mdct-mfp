// components
import { Box, Button } from "@chakra-ui/react";
import { Form, ReportPageFooter, ReportPageIntro } from "components";
// types
import { AnyObject, ReportStatus, StandardReportPageShape } from "types";
// utils
import { getReportsByState, postReport } from "utils/api/requestMethods/report";
import { mockStandardReportPageJson } from "utils/testing/mockForm";

export const StandardReportPage = ({ route, validateOnRender }: Props) => {
  const submitting = false;

  const reportMetaData = {
    metadata: {
      programName: "testProgram",
      reportType: "WP",
      status: ReportStatus.NOT_STARTED,
      isComplete: false,
      createdAt: 162515200000,
      lastAlteredBy: "Thelonious States",
    },
    fieldData: {
      programName: "testProgram",
    },
  };

  const createReport = async (
    reportType: string,
    state: string,
    report: AnyObject
  ) => {
    try {
      await postReport(reportType, state, report);
      console.log("Post succeeded");
    } catch (e: any) {
      console.error("Unable to create report");
    }
  };

  const fetchReportsByState = async (
    reportType: string,
    selectedState: string
  ) => {
    try {
      const result = await getReportsByState(reportType, selectedState);
      console.log(result);
    } catch (e: any) {
      console.error("Unable to fetch reports");
    }
  };

  return (
    <Box>
      {route.verbiage.intro && <ReportPageIntro text={route.verbiage.intro} />}
      <Button onClick={() => createReport("WP", "NJ", reportMetaData)}>
        Create Report
      </Button>
      <button onClick={() => fetchReportsByState("WP", "NJ")}>
        Fetch Reports By State
      </button>
      <Form
        id={route.form.id}
        formJson={route.form}
        onSubmit={() => {}}
        formData={mockStandardReportPageJson.form}
        autosave
        validateOnRender={validateOnRender || false}
        dontReset={false}
      />
      <ReportPageFooter submitting={submitting} form={route.form} />
    </Box>
  );
};

interface Props {
  route: StandardReportPageShape;
  validateOnRender?: boolean;
}
