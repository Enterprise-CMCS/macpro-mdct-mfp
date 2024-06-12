import { useContext, useEffect, useState } from "react";
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
  ErrorAlert,
  PrintButton,
  ReportContext,
  ReportDrawer,
  ReportPageFooter,
  ReportPageIntro,
  Table,
} from "components";
// assets
import addIcon from "assets/icons/icon_add.png";
// types
import {
  AnyObject,
  EntityShape,
  EntityType,
  ModalDrawerReportPageShape,
  ReportStatus,
  isFieldElement,
  ErrorVerbiage,
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
  resetClearProp,
} from "utils";
import { getDefaultTargetPopulationNames } from "../../constants";

const alertVerbiage: ErrorVerbiage = {
  title:
    "You must have at least one default target population applicable to your MFP Demonstration",
  description:
    "To correct this, select “Edit” and respond with ”Yes” to at least one default target population, and add quarterly benchmark projections.",
};

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
  const [pageError, setPageError] = useState<ErrorVerbiage>();
  const [modalError, setModalError] = useState<ErrorVerbiage>();
  const { report } = useStore();
  const { updateReport } = useContext(ReportContext);
  const reportFieldDataEntities = report?.fieldData[entityType] || [];
  const selectedEntityName =
    selectedEntity?.transitionBenchmarks_targetPopulationName;
  // create drawerForm from json
  const drawerForm = { ...drawerFormJson };

  const otherText = !selectedEntity?.isRequired ? `Other: ` : ``;
  const drawerTitleText = `${verbiage.drawerTitle} ${otherText}${selectedEntityName}`;

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
    setModalError(undefined);
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
    resetClearProp(drawerForm.fields);
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
    headRow: ["", "", "", ""],
  };

  const defaultsPopsNotSelected = (targetPopulations: AnyObject[]) => {
    const defaultPopulationNames = getDefaultTargetPopulationNames();

    const filteredPopulations = targetPopulations?.filter((population) => {
      const isDefault = defaultPopulationNames.includes(
        population.transitionBenchmarks_targetPopulationName
      );

      const isApplicable =
        population?.transitionBenchmarks_applicableToMfpDemonstration?.[0]
          ?.value;
      return isDefault && isApplicable === "No";
    });
    return filteredPopulations.length === defaultPopulationNames.length;
  };

  useEffect(() => {
    if (entityType === "targetPopulations") {
      if (defaultsPopsNotSelected(reportFieldDataEntities)) {
        setPageError(alertVerbiage);
      } else {
        setPageError(undefined);
      }
    }
  }, [reportFieldDataEntities]);
  return (
    <Box>
      {verbiage.intro && (
        <ReportPageIntro text={verbiage.intro} accordion={verbiage.accordion} />
      )}
      <ErrorAlert error={pageError} sxOverride={sx.pageErrorAlert} />
      <Box>
        <Heading as="h3" sx={sx.dashboardTitle}>
          {verbiage.dashboardTitle}
        </Heading>
        <Box>
          <Table sx={sx.table} content={tableHeaders}>
            {reportFieldDataEntities.map((entity: EntityShape) => (
              <EntityRow
                key={entity.id}
                entity={entity}
                entityInfo={entityInfo}
                verbiage={verbiage}
                openAddEditEntityModal={openAddEditEntityModal}
                openDeleteEntityModal={openDeleteEntityModal}
                openOverlayOrDrawer={openDrawer}
                entityType={entityType as EntityType}
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
          <Text sx={sx.reviewPdfHint}>
            {parseCustomHtml(verbiage.reviewPdfHint)}
          </Text>
          <PrintButton sxOverride={sx.reviewPdfButton} />
        </Box>
        {/* MODALS */}
        <AddEditEntityModal
          entityType={entityType as EntityType}
          selectedEntity={selectedEntity}
          verbiage={verbiage}
          form={modalForm}
          error={modalError}
          setError={setModalError}
          modalDisclosure={{
            isOpen: addEditEntityModalIsOpen,
            onClose: closeAddEditEntityModal,
          }}
        />
        <DeleteEntityModal
          entityType={entityType}
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
            drawerTitle: drawerTitleText,
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
  table: {
    tableLayout: "fixed",
    br: {
      marginBottom: "0.25rem",
    },
    th: {
      paddingLeft: "1rem",
      paddingRight: "0",
      borderBottom: "1px solid",
      borderColor: "palette.gray_lighter",
      ".tablet &, .mobile &": {
        border: "none",
      },
      "&:nth-of-type(1)": {
        width: "2.5rem",
      },
      "&:nth-of-type(3)": {
        width: "260px",
      },
    },
  },
  pageErrorAlert: {
    marginBottom: "1.5rem",
  },
  reviewPdfHint: {
    color: "palette.gray_medium",
  },
  reviewPdfButton: { marginTop: "1.5rem" },
};
