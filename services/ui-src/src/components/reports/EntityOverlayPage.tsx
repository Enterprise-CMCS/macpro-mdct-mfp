// components
import { Box } from "@chakra-ui/react";
import { Alert, Form, ReportPageFooter, ReportPageIntro } from "components";
// types
import { AlertTypes, EntityOverlayPageShape } from "types";

export const EntityOverlayPage = ({ route, validateOnRender }: Props) => {
  const submitting = false;
  const { verbiage } = route;

  return (
    <Box>
      {verbiage.intro && <ReportPageIntro text={verbiage.intro} />}
      <Form
        id={route.form.id}
        formJson={route.form}
        onSubmit={() => {}}
        //formData={mockStandardReportPageJson.form}
        autosave
        validateOnRender={validateOnRender || false}
        dontReset={false}
      />
      <Box>
        {verbiage.closeOutWarning && (
          <Alert
            title={verbiage.closeOutWarning.title}
            status={AlertTypes.WARNING}
            description={verbiage.closeOutWarning.description}
          />
        )}
      </Box>
      <ReportPageFooter submitting={submitting} form={route.form} />
    </Box>
  );
};

interface Props {
  route: EntityOverlayPageShape;
  validateOnRender?: boolean;
}
