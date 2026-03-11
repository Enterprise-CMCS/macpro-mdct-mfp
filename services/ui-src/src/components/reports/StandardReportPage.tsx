import { useState, useContext } from "react";
import { useNavigate } from "react-router";
// components
import { Box, Text } from "@chakra-ui/react";
import {
  Form,
  PrintButton,
  ReportContext,
  ReportPageFooter,
  ReportPageIntro,
} from "components";
// types
import {
  StandardReportPageShape,
  AnyObject,
  isFieldElement,
  ReportStatus,
  ReportShape,
} from "types";
// utils
import {
  addDynamicTableRowsValidation,
  filterFormData,
  filterResubmissionData,
  parseCustomHtml,
  useFindRoute,
  useStore,
} from "utils";

export const StandardReportPage = ({
  route,
  validateOnRender = false,
}: Props) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { report = {} as ReportShape } = useStore();
  const { updateReport } = useContext(ReportContext);
  const navigate = useNavigate();
  const { full_name, state } = useStore().user ?? {};
  const { nextRoute } = useFindRoute(
    report.formTemplate?.flatRoutes,
    report.formTemplate?.basePath
  );

  const onError = () => {
    navigate(nextRoute);
  };

  const onSubmit = async (enteredData: AnyObject) => {
    setSubmitting(true);
    const reportKeys = {
      reportType: report.reportType,
      state: state,
      id: report.id,
    };
    const filteredFormData = filterFormData(
      enteredData,
      route.form.fields.filter(isFieldElement)
    );
    const dataToWrite = {
      metadata: {
        status: ReportStatus.IN_PROGRESS,
        lastAlteredBy: full_name,
      },
      fieldData: filteredFormData,
    };
    await updateReport(reportKeys, dataToWrite);
    setSubmitting(false);

    navigate(nextRoute);
  };

  const formData = report.fieldData;
  let form = filterResubmissionData(route.form, report);
  form = addDynamicTableRowsValidation(form, formData);

  return (
    <Box>
      {route.verbiage.intro && (
        <ReportPageIntro
          accordion={route.verbiage.accordion}
          reportPeriod={report.reportPeriod}
          reportYear={report.reportYear}
          text={route.verbiage.intro}
        />
      )}
      <Form
        id={route.form.id}
        formJson={form}
        onSubmit={onSubmit}
        onError={onError}
        formData={formData}
        autosave
        validateOnRender={validateOnRender}
        dontReset={false}
      />
      {route.verbiage.reviewPdfHint && (
        <Box>
          <Text sx={sx.reviewPdfHint}>
            {parseCustomHtml(route.verbiage.reviewPdfHint)}
          </Text>
          <PrintButton />
        </Box>
      )}
      <ReportPageFooter
        submitting={submitting}
        form={route.form}
        praDisclosure={route.verbiage.praDisclosure}
      />
    </Box>
  );
};

interface Props {
  route: StandardReportPageShape;
  validateOnRender?: boolean;
}

const sx = {
  reviewPdfHint: {
    paddingTop: "spacer5",
    paddingBottom: "spacer5",
    color: "gray",
  },
};
