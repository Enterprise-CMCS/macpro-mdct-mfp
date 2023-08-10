// components
import { Box, Button, Heading, Text, useDisclosure } from "@chakra-ui/react";
import {
  AddEditReportModal,
  AddEditEntityModal,
  PageTemplate,
  DeleteEntityModal,
  DeleteDynamicFieldRecordModal,
} from "components";
import { mockModalDrawerReportPageJson } from "utils/testing/mockForm";
// utils
import verbiage from "verbiage/pages/home";

export const HomePage = () => {
  const { intro } = verbiage;

  // add/edit program modal disclosure
  const {
    isOpen: addEditReportModalIsOpen,
    onOpen: addEditReportModalOnOpenHandler,
    onClose: addEditReportModalOnCloseHandler,
  } = useDisclosure();

  // add/edit entity modal disclosure and methods
  const {
    isOpen: addEditEntityModalIsOpen,
    onOpen: addEditEntityModalOnOpenHandler,
    onClose: addEditEntityModalOnCloseHandler,
  } = useDisclosure();

  // delete modal disclosure and methods
  const {
    isOpen: deleteEntityModalIsOpen,
    onOpen: deleteEntityModalOnOpenHandler,
    onClose: deleteEntityModalOnCloseHandler,
  } = useDisclosure();

  // delte dynamic field disclosure and methods
  const {
    isOpen: deleteProgramModalIsOpen,
    onOpen: deleteProgramModalOnOpenHandler,
    onClose: deleteProgramModalOnCloseHandler,
  } = useDisclosure();

  return (
    <PageTemplate sx={sx.layout} data-testid="home-view">
      <Box sx={sx.introTextBox}>
        <Heading as="h1" sx={sx.headerText}>
          {intro.header}
        </Heading>
        <Text></Text>
        <Box>
          <Button
            type="submit"
            onClick={() => addEditReportModalOnOpenHandler()}
          >
            Open Add/Edit Report Modal
          </Button>
        </Box>
        <Box>
          <Button
            type="submit"
            onClick={() => addEditEntityModalOnOpenHandler()}
          >
            Open Add/Edit Entity Modal
          </Button>
        </Box>

        <Box>
          <Button
            type="submit"
            onClick={() => deleteEntityModalOnOpenHandler()}
          >
            Open Delete Entity Modal
          </Button>
        </Box>

        <Box>
          <Button
            type="submit"
            onClick={() => deleteProgramModalOnOpenHandler()}
          >
            Open Delete Dynamic Field Modal
          </Button>
        </Box>
      </Box>
      <AddEditReportModal
        selectedReport={{}}
        reportType={"MFP"}
        modalDisclosure={{
          isOpen: addEditReportModalIsOpen,
          onClose: addEditReportModalOnCloseHandler,
        }}
      />
      <AddEditEntityModal
        selectedEntity={{ id: "123" }}
        verbiage={mockModalDrawerReportPageJson.verbiage}
        form={mockModalDrawerReportPageJson.modalForm}
        modalDisclosure={{
          isOpen: addEditEntityModalIsOpen,
          onClose: addEditEntityModalOnCloseHandler,
        }}
      />
      <DeleteEntityModal
        selectedEntity={{ id: "123" }}
        verbiage={mockModalDrawerReportPageJson.verbiage}
        modalDisclosure={{
          isOpen: deleteEntityModalIsOpen,
          onClose: deleteEntityModalOnCloseHandler,
        }}
      />

      <DeleteDynamicFieldRecordModal
        selectedRecord={{ id: "123" }}
        deleteRecord={() => {}}
        entityType={"plans"}
        modalDisclosure={{
          isOpen: deleteProgramModalIsOpen,
          onClose: deleteProgramModalOnCloseHandler,
        }}
      />
    </PageTemplate>
  );
};

const sx = {
  layout: {
    ".contentFlex": {
      marginTop: "3.5rem",
    },
  },
  introTextBox: {
    width: "100%",
    marginBottom: "2.25rem",
  },
  headerText: {
    marginBottom: "1rem",
    fontSize: "2rem",
    fontWeight: "normal",
  },
  card: {
    marginBottom: "2rem",
  },
};
