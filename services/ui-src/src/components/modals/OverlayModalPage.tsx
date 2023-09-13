import { useState } from "react";
// components
import { Box, Button, Image, useDisclosure } from "@chakra-ui/react";
import {
  AddEditEntityModal,
  InstructionsAccordion,
  ReportPageFooter,
  ReportPageIntro,
} from "components";
// assets
import addIcon from "assets/icons/icon_add_white.png";
// types
import { EntityShape, OverlayModalPageShape } from "types";
import { AnyObject } from "yup/lib/types";

export const OverlayModalPage = ({ accordion, route }: Props) => {
  const { verbiage, modalForm } = route;
  const [selectedEntity, setSelectedEntity] = useState<EntityShape | undefined>(
    undefined
  );

  //display variables

  ///TEMPORARY ENTITY//

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
      <Box>
        {accordion && <InstructionsAccordion verbiage={accordion} />}
        <Box>
          <Button
            sx={sx.addEntityButton}
            onClick={addEditEntityModalOnOpenHandler}
            leftIcon={<Image sx={sx.buttonIcons} src={addIcon} alt="Add" />}
          >
            {verbiage.addEntityButtonText}
          </Button>
        </Box>
        <hr />
        {/* MODALS */}
        <AddEditEntityModal
          selectedEntity={selectedEntity}
          verbiage={verbiage}
          form={modalForm}
          modalDisclosure={{
            isOpen: addEditEntityModalIsOpen,
            onClose: closeAddEditEntityModal,
          }}
        />
      </Box>
      <ReportPageFooter />
    </Box>
  );
};

interface Props {
  accordion?: AnyObject;
  route: OverlayModalPageShape;
  validateOnRender?: boolean;
}

const sx = {
  buttonIcons: {
    height: "1rem",
  },
  dashboardTitle: {
    paddingBottom: "0",
    fontWeight: "bold",
    color: "palette.gray_medium",
  },
  addEntityButton: {
    marginTop: "1.5rem",
    marginBottom: "2rem",
  },
  table: {},
  reviewPdfButton: { marginTop: "1.5rem", marginBottom: "2rem" },
};
