// components
import { Box } from "@chakra-ui/react";
import { Form, ReportPageFooter, ReportPageIntro } from "components";
import { StandardReportPageShape } from "types";
import { mockStandardReportPageJson } from "utils/testing/mockForm";

// utils

export const StandardReportPage = ({ route, validateOnRender }: Props) => {
  const submitting = false;
  return (
    <Box>
      {route.verbiage.intro && <ReportPageIntro text={route.verbiage.intro} />}
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
