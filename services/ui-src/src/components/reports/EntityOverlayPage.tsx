import { useNavigate } from "react-router-dom";
// components
import { Box } from "@chakra-ui/react";
import { Form, ReportPageFooter, ReportPageIntro } from "components";
// types
import { StandardReportPageShape } from "types";
// utils
import { useFindRoute, useStore } from "utils";
// verbiage
import { mockStandardReportPageJson } from "utils/testing/mockForm";

export const EntityOverlayPage = ({ route, validateOnRender }: Props) => {
  const submitting = false;
  const navigate = useNavigate();
  const report = useStore().report;
  const { nextRoute } = useFindRoute(
    report?.formTemplate.flatRoutes!,
    report?.formTemplate.basePath
  );

  const onError = () => {
    navigate(nextRoute);
  };

  return (
    <Box>
      {route.verbiage.intro && <ReportPageIntro text={route.verbiage.intro} />}
      <Form
        id={route.form.id}
        formJson={route.form}
        onSubmit={() => {}}
        onError={onError}
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
