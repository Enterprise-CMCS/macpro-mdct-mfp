import { useState } from "react";
// components
import { Box, Button, Image, useDisclosure } from "@chakra-ui/react";
import {
  Alert,
  Form,
  ReportPageFooter,
  ReportPageIntro,
  CloseEntityModal,
} from "components";
// types
import { EntityShape, AlertTypes, EntityOverlayPageShape } from "types";
// assets
import closeIcon from "assets/icons/icon_close.png";

export const EntityOverlayPage = ({ route, validateOnRender }: Props) => {
  const submitting = false;
  const [selectedEntity, setSelectedEntity] = useState<EntityShape | undefined>(
    undefined
  );
  const { verbiage } = route;

  // add/edit entity modal disclosure and methods
  const {
    isOpen: closeEntityModalIsOpen,
    onOpen: closeEntityModalOnOpenHandler,
    onClose: closeEntityModalOnCloseHandler,
  } = useDisclosure();

  const openCloseEntityModal = (entity?: EntityShape) => {
    setSelectedEntity(entity);
    closeEntityModalOnOpenHandler();
  };

  const closeCloseEntityModal = () => {
    setSelectedEntity(undefined);
    closeEntityModalOnCloseHandler();
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
      </Box>

      <Box>
        {verbiage.closeOutModal && (
          <Box>
            <Button
              rightIcon={
                <Image src={closeIcon} alt="Close" sx={sx.closeIcon} />
              }
              onClick={() => openCloseEntityModal()}
            >
              {verbiage.closeOutModal.closeOutModalButtonText}
            </Button>

            <CloseEntityModal
              selectedEntity={selectedEntity}
              verbiage={verbiage}
              modalDisclosure={{
                isOpen: closeEntityModalIsOpen,
                onClose: closeCloseEntityModal,
              }}
            />
          </Box>
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

const sx = {
  closeIcon: {
    width: "0.75rem",
  },
};
