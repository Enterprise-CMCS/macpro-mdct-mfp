import { useContext, useState } from "react";
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
  ReportContext,
  ReportDrawer,
  ReportPageFooter,
  ReportPageIntro,
  Table,
} from "components";
// assets
import addIcon from "assets/icons/icon_add.png";
import searchIcon from "assets/icons/icon_search_blue.png";
// types
import {
  AnyObject,
  EntityShape,
  EntityType,
  ModalDrawerReportPageShape,
  ReportStatus,
  isFieldElement,
} from "types";
// utils
import {
  parseCustomHtml,
  getFormattedEntityData,
  useStore,
  filterFormData,
  getEntriesToClear,
  setClearedEntriesToDefaultValue,
  entityWasUpdated,
} from "utils";

export const ModalDrawerReportPage = ({ route, validateOnRender }: Props) => {
  const { full_name, state, userIsEndUser } = useStore().user ?? {};
  const {
    entityType,
    entityInfo,
    verbiage,
    modalForm,
    drawerForm: drawerFormJson,
  } = route;

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [selectedEntity, setSelectedEntity] = useState<EntityShape | undefined>(
    undefined
  );

  const { report } = useStore();
  const { updateReport } = useContext(ReportContext);
  const reportFieldDataEntities = report?.fieldData[entityType] || [];

  let entities = [
    {
      id: "0",
      transitionBenchmarks_targetPopulationName: "Older adults",
      isOtherEntity: false,
    },
    {
      id: "1",
      transitionBenchmarks_targetPopulationName:
        "Individuals with physical disabilities (PD)",
      isOtherEntity: false,
    },
    {
      id: "2",
      transitionBenchmarks_targetPopulationName:
        "Individuals with intellectual and developmental disabilities (I/DD)",
      isOtherEntity: false,
    },
    {
      id: "3",
      transitionBenchmarks_targetPopulationName:
        "Individuals with mental health and substance abuse disorders (MH/SUD)",
      isOtherEntity: false,
    },
  ];

  entities = entities.concat(reportFieldDataEntities).map((entity) => ({
    ...entity,
    name: entity && entityInfo ? (entity as any)[entityInfo[0] as string] : "",
  }));

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

  const openDeleteEntityModal = (entity: EntityShape) => {
    setSelectedEntity(entity);
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

  const onSubmit = async (enteredData: AnyObject) => {
    if (userIsEndUser) {
      setSubmitting(true);
      const reportKeys = {
        reportType: report?.reportType,
        state: state,
        id: report?.id,
      };
      const currentEntities = [...(report?.fieldData[entityType] || [])];
      const selectedEntityIndex = report?.fieldData[entityType].findIndex(
        (entity: EntityShape) => entity.id === selectedEntity?.id
      );
      const filteredFormData = filterFormData(
        enteredData,
        drawerForm.fields.filter(isFieldElement)
      );
      const entriesToClear = getEntriesToClear(
        enteredData,
        drawerForm.fields.filter(isFieldElement)
      );
      const newEntity = {
        ...selectedEntity,
        ...filteredFormData,
      };
      let newEntities = currentEntities;
      newEntities[selectedEntityIndex] = newEntity;
      newEntities[selectedEntityIndex] = setClearedEntriesToDefaultValue(
        newEntities[selectedEntityIndex],
        entriesToClear
      );
      const shouldSave = entityWasUpdated(
        reportFieldDataEntities[selectedEntityIndex],
        newEntity
      );
      if (shouldSave) {
        const dataToWrite = {
          metadata: {
            status: ReportStatus.IN_PROGRESS,
            lastAlteredBy: full_name,
          },
          fieldData: {
            [entityType]: newEntities,
          },
        };
        await updateReport(reportKeys, dataToWrite);
      }
      setSubmitting(false);
    }
    closeDrawer();
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
                entityInfo={entityInfo}
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
            leftIcon={<Image sx={sx.buttonIcons} src={addIcon} alt="Add" />}
          >
            {verbiage.addEntityButtonText}
          </Button>
        </Box>
        <Box>
          <Text>{parseCustomHtml(verbiage.reviewPdfHint)}</Text>
          <Button
            sx={sx.reviewPdfButton}
            variant="outline"
            leftIcon={
              <Image sx={sx.buttonIcons} src={searchIcon} alt="Review" />
            }
          >
            Review PDF
          </Button>
        </Box>
        <hr />
        {/* MODALS */}
        <AddEditEntityModal
          entityType={entityType as EntityType}
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
            drawerTitle: `${verbiage.drawerTitle} ${selectedEntity?.name}`,
            drawerDetails: getFormattedEntityData(entityType),
          }}
          form={drawerForm}
          onSubmit={onSubmit}
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
