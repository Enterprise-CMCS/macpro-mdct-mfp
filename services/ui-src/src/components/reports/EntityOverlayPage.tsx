import { useState } from "react";
// components
import { Box, Button, useDisclosure } from "@chakra-ui/react";
import {
  Alert,
  Form,
  ReportPageFooter,
  ReportPageIntro,
  AddEditEntityModal,
} from "components";
// types
import { EntityShape, AlertTypes, EntityOverlayPageShape } from "types";

export const EntityOverlayPage = ({ route, validateOnRender }: Props) => {
  const submitting = false;
  const [selectedEntity, setSelectedEntity] = useState<EntityShape | undefined>(
    undefined
  );
  const { verbiage, modalForm } = route;

  // add/edit entity modal disclosure and methods
  const {
    isOpen: addEditEntityModalIsOpen,
    onOpen: addEditEntityModalOnOpenHandler,
    onClose: addEditEntityModalOnCloseHandler,
  } = useDisclosure();

  const closeAddEditEntityModal = () => {
    setSelectedEntity(undefined);
    addEditEntityModalOnCloseHandler();
  };

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

        <Button
          //sx={sx.addEntityButton}
          variant="outline"
          onClick={addEditEntityModalOnOpenHandler}
          //leftIcon={<Image sx={sx.buttonIcons} src={addIcon} alt="Add" />}
        >
          {"test"}
        </Button>
        <hr />
        {/* MODAL */}
        {modalForm && (
          <AddEditEntityModal
            selectedEntity={selectedEntity}
            verbiage={verbiage}
            form={modalForm}
            modalDisclosure={{
              isOpen: addEditEntityModalIsOpen,
              onClose: closeAddEditEntityModal,
            }}
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
