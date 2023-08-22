import { useState } from "react";
// components
import {
  Box,
  Button,
  Heading,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  AddEditEntityModal,
  DeleteEntityModal,
  EntityRow,
  ReportDrawer,
  ReportPageFooter,
  ReportPageIntro,
  Table,
} from "components";
// assets
import addIcon from "assets/icons/icon_add.png";
// types
import { EntityShape, EntityType, ModalDrawerReportPageShape } from "types";
// utils
import { parseCustomHtml } from "utils";
import { getFormattedEntityData } from "utils/reports/entities";

export const ModalDrawerReportPage = ({ route, validateOnRender }: Props) => {
  const { entityType, verbiage, modalForm, drawerForm: drawerFormJson } = route;

  // const reportFieldDataEntities = report?.fieldData[entityType] || [];

  const submitting = false;
  const [selectedEntity, setSelectedEntity] = useState<EntityShape | undefined>(
    undefined
  );

  const entities = [
    {
      id: "0",
      name: "Older adults",
      isOtherEntity: false,
    },
    {
      id: "1",
      name: "Individuals with physical disabilities (PD)",
      isOtherEntity: false,
    },
    {
      id: "2",
      name: "Individuals with intellectual and developmental disabilities (I/DD)",
      isOtherEntity: false,
    },
    {
      id: "3",
      name: "Individuals with mental health and substance abuse disorders (MH/SUD)",
      isOtherEntity: false,
    },
  ];

  // create drawerForm from json
  const drawerForm = { ...drawerFormJson };

  // add/edit entity modal disclosure and methods
  const {
    isOpen: addEditEntityModalIsOpen,
    onOpen: addEditEntityModalOnOpenHandler,
    onClose: addEditEntityModalOnCloseHandler,
  } = useDisclosure();

  const openAddEditEntityModal = (entity?: EntityShape) => {
    if (entity) setSelectedEntity(entity);
    addEditEntityModalOnOpenHandler();
  };

  const closeAddEditEntityModal = () => {
    setSelectedEntity(undefined);
    addEditEntityModalOnCloseHandler();
  };

  // delete modal disclosure and methods
  const {
    isOpen: deleteEntityModalIsOpen,
    onOpen: deleteEntityModalOnOpenHandler,
    onClose: deleteEntityModalOnCloseHandler,
  } = useDisclosure();

  const openDeleteEntityModal = () => {
    setSelectedEntity({
      id: "123",
      name: "mock entity",
    });
    deleteEntityModalOnOpenHandler();
  };

  const closeDeleteEntityModal = () => {
    setSelectedEntity(undefined);
    deleteEntityModalOnCloseHandler();
  };

  // report drawer disclosure and methods
  const {
    isOpen: drawerIsOpen,
    onOpen: drawerOnOpenHandler,
    onClose: drawerOnCloseHandler,
  } = useDisclosure();

  const openDrawer = (entity: EntityShape) => {
    setSelectedEntity(entity);
    drawerOnOpenHandler();
  };

  const closeDrawer = () => {
    setSelectedEntity(undefined);
    drawerOnCloseHandler();
  };

  const tableHeaders = {
    headRow: ["", "", ""],
  };

  return (
    <Box>
      {verbiage.intro && <ReportPageIntro text={verbiage.intro} />}
      <Box>
        <Heading as="h3" sx={sx.dashboardTitle}>
          {verbiage.dashboardTitle}
        </Heading>
        <Box>
          <Table sx={sx.table} content={tableHeaders}>
            {/* TODO: real entities */}
            {entities.map((entity: EntityShape) => (
              <EntityRow
                key={entity.id}
                entity={entity}
                verbiage={verbiage}
                openAddEditEntityModal={openAddEditEntityModal}
                openDeleteEntityModal={openDeleteEntityModal}
                openDrawer={openDrawer}
              />
            ))}
          </Table>
          <Button
            sx={sx.addEntityButton}
            variant="outline"
            onClick={addEditEntityModalOnOpenHandler}
            leftIcon={<Image sx={sx.addIcon} src={addIcon} alt="Add" />}
          >
            {verbiage.addEntityButtonText}
          </Button>
        </Box>
        <Box>
          <Text>{parseCustomHtml(verbiage.reviewPdfHint)}</Text>
          <Button sx={sx.reviewPdfButton} variant="outline">
            Review PDF
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
        <DeleteEntityModal
          selectedEntity={selectedEntity}
          verbiage={verbiage}
          modalDisclosure={{
            isOpen: deleteEntityModalIsOpen,
            onClose: closeDeleteEntityModal,
          }}
        />
        {/* DRAWER */}
        <ReportDrawer
          entityType={entityType as EntityType}
          selectedEntity={selectedEntity!}
          verbiage={{
            ...verbiage,
            drawerDetails: getFormattedEntityData(),
          }}
          form={drawerForm}
          onSubmit={() => {}}
          submitting={submitting}
          drawerDisclosure={{
            isOpen: drawerIsOpen,
            onClose: closeDrawer,
          }}
          validateOnRender={validateOnRender}
          data-testid="report-drawer"
        />
      </Box>
      <ReportPageFooter />
    </Box>
  );
};

interface Props {
  route: ModalDrawerReportPageShape;
  validateOnRender?: boolean;
}

const sx = {
  addIcon: {
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
