import { ComponentClass, useState, useContext, useEffect } from "react";
import { Helmet as HelmetImport, HelmetProps } from "react-helmet";
// components
import { Box } from "@chakra-ui/react";
import { Form, ReportContext, ReportPageIntro } from "components";
// types
import {
  AnyObject,
  FormJson,
  ReportShape,
  ReportStatus,
  StandardReportPageShape,
} from "types";
// utils
import {
  addDynamicTableRowsValidation,
  filterFormData,
  filterResubmissionData,
  getPageTitle,
  isFieldElement,
  useStore,
} from "utils";

export const StandardReportPage = ({
  route,
  validateOnRender = false,
  setSubmitting,
}: Props) => {
  const Helmet = HelmetImport as ComponentClass<HelmetProps>;

  const [form, setForm] = useState<FormJson>({} as FormJson);
  const [formData, setFormData] = useState<AnyObject>({});
  const { report = {} as ReportShape } = useStore();
  const { updateReport } = useContext(ReportContext);
  const { full_name, state } = useStore().user ?? {};

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
  };

  useEffect(() => {
    const fieldData = report.fieldData;
    let formJson = filterResubmissionData(route.form, report);
    formJson = addDynamicTableRowsValidation(formJson, fieldData);

    setForm(formJson);
    setFormData(fieldData);
  }, [report, route]);

  return (
    <Box>
      {/* page title */}
      <Helmet>
        <title>{report && getPageTitle(report.reportType, route.name)}</title>
      </Helmet>
      {route.verbiage.intro && (
        <ReportPageIntro
          accordion={route.verbiage.accordion}
          reportPeriod={report.reportPeriod}
          reportYear={report.reportYear}
          text={route.verbiage.intro}
        />
      )}
      {form.fields && (
        <Form
          id={route.form.id}
          formJson={form}
          onSubmit={onSubmit}
          formData={formData}
          autosave
          validateOnRender={validateOnRender}
          dontReset={false}
        />
      )}
    </Box>
  );
};

interface Props {
  route: StandardReportPageShape;
  validateOnRender?: boolean;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}
