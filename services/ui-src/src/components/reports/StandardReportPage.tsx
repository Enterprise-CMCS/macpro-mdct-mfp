import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// components
import { Box } from "@chakra-ui/react";
import {
  Form,
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
import { filterFormData, useFindRoute, useStore } from "utils";

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
    const formDataCopy = JSON.parse(JSON.stringify(formData));
    const formDataFields = JSON.parse(JSON.stringify(formData?.fields));

    //show resubmisison field if report is an 'In Revision' / SAR report
    if (
      (report?.reportType === "SAR" &&
        report?.status === ReportStatus.IN_REVISION) ||
      report?.submissionCount! > 0
    ) {
      return formDataCopy;
    } else {
      const removeResubmissionDataFields: any[] = formDataFields.filter(
        (data: AnyObject) =>
          data.id !== "generalInformation_resubmissionInformation"
      );
      formDataCopy.fields = [...removeResubmissionDataFields];

      return formDataCopy;
    }
  };

  /**
   * generalInformation_resubmissionInformation was set to "N/A" and not "" because textfield sees empty strings as no input
   * future revision should be to allow "" as a valid input for this specific field
   */
  const updateResubmissionValue = async () => {
    const reportKeys = {
      reportType: report?.reportType,
      state: state,
      id: report?.id,
    };
    const dataToWrite = {
      metadata: {
        lastAlteredBy: full_name,
      },
      fieldData: {
        generalInformation_resubmissionInformation: "N/A",
      },
    };

    await updateReport(reportKeys, dataToWrite);
  };

  useEffect(() => {
    if (location?.pathname === "/sar/general-information") {
      updateResubmissionValue();
    }
  }, [location?.pathname]);

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
