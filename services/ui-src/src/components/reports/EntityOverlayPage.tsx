import { useState } from "react";
// components
import { Box } from "@chakra-ui/react";
import {
  AddEditEntityModal,
  Alert,
  Form,
  ReportPageFooter,
  ReportPageIntro,
} from "components";
// types
import { AlertTypes, EntityShape, EntityOverlayPageShape } from "types";
//import { mockStandardReportPageJson } from "utils/testing/mockForm";
import alertVerbiage from "../../verbiage/pages/wp/wp-alerts";

interface AlertVerbiage {
  [key: string]: { title: string; description: string };
}

export const EntityOverlayPage = ({ route, validateOnRender }: Props) => {
  const submitting = false;
  const { entityType, verbiage, modalForm } = route;

  // Context Information
  const [currentEntity] = useState<EntityShape | undefined>(undefined);

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
        <Alert
          title={(alertVerbiage as AlertVerbiage)[entityType].title}
          status={AlertTypes.ERROR}
          description={(alertVerbiage as AlertVerbiage)[entityType].description}
        />

        <AddEditEntityModal
          //entityType={entityType}
          selectedEntity={currentEntity}
          verbiage={verbiage}
          form={modalForm}
          modalDisclosure={{
            isOpen: false,
            onClose: false,
          }}
        />
      </Box>
      <ReportPageFooter submitting={submitting} form={route.form} />
    </Box>
  );
};

interface Props {
  route: EntityOverlayPageShape;
  validateOnRender?: boolean;
}
