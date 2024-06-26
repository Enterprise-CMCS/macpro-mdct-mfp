import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
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
  FormJson,
} from "types";
// utils
import { filterFormData, parseCustomHtml, useFindRoute, useStore } from "utils";

export const StandardReportPage = ({ route, validateOnRender }: Props) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { report } = useStore();
  const { updateReport } = useContext(ReportContext);
  const navigate = useNavigate();
  const { full_name, state } = useStore().user ?? {};
  const { nextRoute } = useFindRoute(
    report?.formTemplate.flatRoutes!,
    report?.formTemplate.basePath
  );

  const onError = () => {
    navigate(nextRoute);
  };

  const onSubmit = async (enteredData: AnyObject) => {
    setSubmitting(true);
    const reportKeys = {
      reportType: report?.reportType,
      state: state,
      id: report?.id,
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

  const filterResubmissionData = (formData: FormJson) => {
    //make deep copies of formData
    const formDataCopy = structuredClone(formData);
    const formDataFields = structuredClone(formData?.fields);

    const hideResubmissionField = () => {
      const removeResubmissionDataFields: any[] = formDataFields.filter(
        (data: AnyObject) =>
          data.id !== "generalInformation_resubmissionInformation"
      );
      formDataCopy.fields = [...removeResubmissionDataFields];

      return formDataCopy;
    };

    if (
      (report?.reportType === "SAR" && !report?.submissionCount) ||
      (report?.status === ReportStatus.SUBMITTED &&
        report?.submissionCount! === 1 &&
        report.locked)
    ) {
      return hideResubmissionField();
    } else {
      return formDataCopy;
    }
  };
  return (
    <Box>
      {route.verbiage?.intro && (
        <ReportPageIntro
          text={route.verbiage.intro}
          reportPeriod={report?.reportPeriod}
          reportYear={report?.reportYear}
        />
      )}
      <Form
        id={route.form.id}
        formJson={filterResubmissionData(route.form)}
        onSubmit={onSubmit}
        onError={onError}
        formData={report?.fieldData}
        autosave
        validateOnRender={validateOnRender || false}
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
  report?: ReportShape;
}

const sx = {
  reviewPdfHint: {
    paddingTop: "2.5rem",
    paddingBottom: "2.5rem",
    color: "palette.gray_medium",
  },
};
