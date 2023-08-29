// components
import { Box } from "@chakra-ui/react";
import { Form, ReportPageFooter, ReportPageIntro } from "components";
// types
import { StandardReportPageShape } from "types";
// verbiage
import { mockStandardReportPageJson } from "utils/testing/mockForm";

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
