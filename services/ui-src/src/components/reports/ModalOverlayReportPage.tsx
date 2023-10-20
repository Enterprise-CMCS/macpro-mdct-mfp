import { useContext, useMemo, useState } from "react";
// components
import { Box, Button, Heading, useDisclosure, Image } from "@chakra-ui/react";
import {
  AddEditEntityModal,
  Alert,
  DeleteEntityModal,
  EntityDetailsDashboardOverlay,
  EntityProvider,
  EntityRow,
  ReportContext,
  ReportPageFooter,
  ReportPageIntro,
  Table,
} from "components";
// types
import {
  AlertTypes,
  AnyObject,
  EntityShape,
  EntityType,
  isFieldElement,
  ModalOverlayReportPageShape,
  ReportStatus,
  EntityDetailsDashboardOverlayShape,
} from "types";
// utils
import {
  entityWasUpdated,
  filterFormData,
  getEntriesToClear,
  resetClearProp,
  setClearedEntriesToDefaultValue,
  useBreakpoint,
  useStore,
} from "utils";
// verbiage
import alertVerbiage from "../../verbiage/pages/wp/wp-alerts";
// assets
import addIcon from "assets/icons/icon_add_white.png";
import { getWPAlertStatus } from "../alerts/getWPAlertStatus";

interface AlertVerbiage {
  [key: string]: { title: string; description: string };
}

export const ModalOverlayReportPage = ({
  route,
  setSidebarHidden,
  validateOnRender,
}: Props) => {
  // Route Information
  const {
    entityType,
    verbiage,
    modalForm,
    overlayForm,
    dashboard,
    entityInfo,
  } = route;
  // Context Information
  const { isTablet, isMobile } = useBreakpoint();
  const { report } = useStore();
  const [isEntityDetailsOpen, setIsEntityDetailsOpen] = useState<boolean>();
  const [currentEntity, setCurrentEntity] = useState<EntityShape | undefined>(
    undefined
  );
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { userIsEndUser, full_name, state } = useStore().user ?? {};
  const { updateReport } = useContext(ReportContext);

  // Determine whether form is locked or unlocked based on user and route
  const isLocked = report?.locked;

  // Display Variables
  let reportFieldDataEntities = report?.fieldData[entityType] || [];

  (reportFieldDataEntities as any[]).map(
    (entity) => (entity["isOtherEntity"] = true)
  );

  //only update alert if there's been a change to the report data
  let showAlert = useMemo(() => {
    return report && (alertVerbiage as AlertVerbiage)[entityType]
      ? getWPAlertStatus(report, entityType)
      : false;
  }, [report?.fieldData[entityType]]);

  const dashTitle = `${verbiage.dashboardTitle} ${reportFieldDataEntities.length}`;
  const tableHeaders = () => {
    if (isTablet || isMobile) return { headRow: ["", ""] };
    return { headRow: ["", verbiage.tableHeader, ""] };
  };

  // Add/edit entity modal disclosure and methods
  const {
    isOpen: addEditEntityModalIsOpen,
    onOpen: addEditEntityModalOnOpenHandler,
    onClose: addEditEntityModalOnCloseHandler,
  } = useDisclosure();

  const openAddEditEntityModal = (entity?: EntityShape) => {
    if (entity) setCurrentEntity(entity);
    addEditEntityModalOnOpenHandler();
  };

  const closeAddEditEntityModal = () => {
    setCurrentEntity(undefined);
    resetClearProp(modalForm.fields);
    addEditEntityModalOnCloseHandler();
  };

  // Delete entity modal disclosure and methods
  const {
    isOpen: deleteEntityModalIsOpen,
    onOpen: deleteEntityModalOnOpenHandler,
    onClose: deleteEntityModalOnCloseHandler,
  } = useDisclosure();

  const openDeleteEntityModal = (entity: EntityShape) => {
    setCurrentEntity(entity);
    deleteEntityModalOnOpenHandler();
  };

  const closeDeleteEntityModal = () => {
    setCurrentEntity(undefined);
    deleteEntityModalOnCloseHandler();
  };

  // Open/Close overlay action methods
  const openEntityDetailsOverlay = (entity: EntityShape) => {
    setCurrentEntity(entity);
    setIsEntityDetailsOpen(true);
    setSidebarHidden(true);
  };

  const closeEntityDetailsOverlay = () => {
    setCurrentEntity(undefined);
    setIsEntityDetailsOpen(false);
    setSidebarHidden(false);
  };

  // Form submit methods
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
        (entity: EntityShape) => entity.id === currentEntity?.id
      );
      const filteredFormData = filterFormData(
        enteredData,
        overlayForm!.fields.filter(isFieldElement)
      );
      const entriesToClear = getEntriesToClear(
        enteredData,
        overlayForm!.fields.filter(isFieldElement)
      );
      const newEntity = {
        ...currentEntity,
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
    closeEntityDetailsOverlay();
    setSidebarHidden(false);
  };

  return (
    <Box>
      {dashboard && isEntityDetailsOpen && currentEntity ? (
        <EntityProvider>
          <EntityDetailsDashboardOverlay
            closeEntityDetailsOverlay={closeEntityDetailsOverlay}
            entityType={entityType as EntityType}
            dashboard={dashboard}
            selectedEntity={currentEntity}
            onSubmit={onSubmit}
            submitting={submitting}
            validateOnRender={validateOnRender}
            route={route as EntityDetailsDashboardOverlayShape}
          />
        </EntityProvider>
      ) : (
        <Box sx={sx.content}>
          <ReportPageIntro text={verbiage.intro} />
          {showAlert && (
            <Alert
              title={(alertVerbiage as AlertVerbiage)[route.entityType].title}
              status={AlertTypes.ERROR}
              description={
                (alertVerbiage as AlertVerbiage)[route.entityType].description
              }
            />
          )}
          <Box>
            <Heading as="h3" sx={sx.dashboardTitle}>
              {dashTitle}
            </Heading>
            {reportFieldDataEntities.length === 0 ? (
              <Box>{verbiage.emptyDashboardText}</Box>
            ) : (
              <Table sx={sx.table} content={tableHeaders()}>
                {reportFieldDataEntities.map((entity: EntityShape) => (
                  <EntityRow
                    key={entity.id}
                    entity={entity}
                    entityType={entityType}
                    entityInfo={entityInfo}
                    verbiage={verbiage}
                    locked={isLocked}
                    openOverlayOrDrawer={openEntityDetailsOverlay}
                    openAddEditEntityModal={openAddEditEntityModal}
                    openDeleteEntityModal={openDeleteEntityModal}
                  />
                ))}
              </Table>
            )}
            <Button
              sx={sx.addEntityButton}
              disabled={isLocked}
              onClick={() => openAddEditEntityModal()}
              rightIcon={<Image src={addIcon} alt="Previous" sx={sx.addIcon} />}
            >
              {verbiage.addEntityButtonText}
            </Button>
          </Box>
          {/* Modals */}
          <AddEditEntityModal
            entityType={entityType}
            selectedEntity={currentEntity}
            verbiage={verbiage}
            form={modalForm}
            modalDisclosure={{
              isOpen: addEditEntityModalIsOpen,
              onClose: closeAddEditEntityModal,
            }}
          />
          <DeleteEntityModal
            entityType={entityType}
            selectedEntity={currentEntity}
            verbiage={verbiage}
            modalDisclosure={{
              isOpen: deleteEntityModalIsOpen,
              onClose: closeDeleteEntityModal,
            }}
          />
          <ReportPageFooter />
        </Box>
      )}
    </Box>
  );
};

interface Props {
  route: ModalOverlayReportPageShape;
  setSidebarHidden: Function;
  validateOnRender?: boolean;
}

const sx = {
  content: {
    ".tablet &, .mobile &": {
      width: "100%",
    },
  },
  dashboardTitle: {
    fontSize: "md",
    fontWeight: "bold",
    color: "palette.gray_medium",
    textAlign: "left",
    ".tablet &, .mobile &": {
      paddingBottom: "0",
    },
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
      borderColor: "palette.gray_light",
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
  addEntityButton: {
    marginTop: "2rem",
    marginBottom: "2rem",
    ".tablet &, .mobile &": {
      wordBreak: "break-word",
      whiteSpace: "break-spaces",
    },
  },
  addIcon: {
    width: "1rem",
  },
};
