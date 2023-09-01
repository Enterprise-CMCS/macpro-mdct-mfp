import { useContext, useState } from "react";
// components
import { Box, Button, Heading, useDisclosure } from "@chakra-ui/react";
import {
  AddEditEntityModal,
  DeleteEntityModal,
  EntityDetailsOverlay,
  EntityProvider,
  EntityRow,
  ReportContext,
  ReportPageFooter,
  ReportPageIntro,
  Table,
} from "components";
// types
import {
  AnyObject,
  EntityShape,
  EntityType,
  isFieldElement,
  ModalOverlayReportPageShape,
  ReportStatus,
} from "types";
// utils
import {
  // entityWasUpdated,
  // filterFormData,
  // getEntriesToClear,
  // setClearedEntriesToDefaultValue,
  useBreakpoint,
  // useUser,
} from "utils";
// verbiage
import accordionVerbiage from "../../verbiage/pages/accordion";

export const ModalOverlayReportPage = ({
  route,
  setSidebarHidden,
  validateOnRender,
}: Props) => {
  // Route Information
  const { entityType, verbiage, modalForm, overlayForm } = route;

  // Context Information
  const { isTablet, isMobile } = useBreakpoint();
  const { fetchReport, updateReport } = useContext(ReportContext);
  const [isEntityDetailsOpen, setIsEntityDetailsOpen] = useState<boolean>();
  const [currentEntity, setCurrentEntity] = useState<EntityShape | undefined>(
    undefined
  );
  const [submitting, setSubmitting] = useState<boolean>(false);

  let report = fetchReport();

  console.log(report);

  // Determine whether form is locked or unlocked based on user and route
  const isLocked = report?.locked;

  // Display Variables
  let reportFieldDataEntities = fetchReport;//?.fieldData[entityType] || [];
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

  const openDrawerDetails = (entity: EntityShape) => {

  };

  const closeEntityDetailsOverlay = () => {
    setCurrentEntity(undefined);
    setIsEntityDetailsOpen(false);
    setSidebarHidden(false);
  };

  // Form submit methods
  const onSubmit = async (enteredData: AnyObject) => {
    // if (userIsEndUser) {
    //   setSubmitting(true);
    //   const reportKeys = {
    //     reportType: report?.reportType,
    //     state: state,
    //     id: report?.id,
    //   };
    //   const currentEntities = [...(report?.fieldData[entityType] || [])];
    //   const selectedEntityIndex = report?.fieldData[entityType].findIndex(
    //     (entity: EntityShape) => entity.id === currentEntity?.id
    //   );
    //   const filteredFormData = filterFormData(
    //     enteredData,
    //     overlayForm!.fields.filter(isFieldElement)
    //   );
    //   const entriesToClear = getEntriesToClear(
    //     enteredData,
    //     overlayForm!.fields.filter(isFieldElement)
    //   );
    //   const newEntity = {
    //     ...currentEntity,
    //     ...filteredFormData,
    //   };
    //   let newEntities = currentEntities;
    //   newEntities[selectedEntityIndex] = newEntity;
    //   newEntities[selectedEntityIndex] = setClearedEntriesToDefaultValue(
    //     newEntities[selectedEntityIndex],
    //     entriesToClear
    //   );
    //   const shouldSave = entityWasUpdated(
    //     reportFieldDataEntities[selectedEntityIndex],
    //     newEntity
    //   );
    //   if (shouldSave) {
    //     const dataToWrite = {
    //       metadata: {
    //         status: ReportStatus.IN_PROGRESS,
    //         lastAlteredBy: full_name,
    //       },
    //       fieldData: {
    //         [entityType]: newEntities,
    //       },
    //     };
    //     await updateReport(reportKeys, dataToWrite);
    //   }
    //   setSubmitting(false);
    // }
    // closeEntityDetailsOverlay();
    // setSidebarHidden(false);
  };

  return (
    <Box>
      {overlayForm && isEntityDetailsOpen && currentEntity ? (
        <EntityProvider>
          <EntityDetailsOverlay
            closeEntityDetailsOverlay={closeEntityDetailsOverlay}
            entityType={entityType as EntityType}
            entities={report?.fieldData[entityType]}
            form={overlayForm}
            onSubmit={onSubmit}
            selectedEntity={currentEntity}
            disabled={false}
            submitting={submitting}
            validateOnRender={validateOnRender}
          />
        </EntityProvider>
      ) : (
        <Box sx={sx.content}>
          <ReportPageIntro
            text={verbiage.intro}
            accordion={accordionVerbiage.WP.formIntro}
            reportType={report?.reportType}
          />

          <Box sx={sx.dashboardBox}>
            <Heading as="h3" sx={sx.dashboardTitle}>
              {dashTitle}
            </Heading>
            {/* {reportFieldDataEntities.length === 0 ? (
              <>
                <Box sx={sx.tableSeparator} />
                <Box sx={sx.emptyDashboard}>{verbiage.emptyDashboardText}</Box>
              </>
            ) : (
              <Table sx={sx.table} content={tableHeaders()}>
                {reportFieldDataEntities.map((entity: EntityShape) =>(
                    <EntityRow
                      key={entity.id}
                      entity={entity}
                      verbiage={verbiage}
                      locked={isLocked}
                      openDrawer = {openDrawerDetails}
                      openAddEditEntityModal={openAddEditEntityModal}
                      openDeleteEntityModal={openDeleteEntityModal}
                      openEntityDetailsOverlay={openEntityDetailsOverlay}
                    />
                  )
                )}
              </Table>
            )} */}
            <Button
              sx={sx.addEntityButton}
              disabled={isLocked}
              onClick={() => openAddEditEntityModal()}
            >
              {verbiage.addEntityButtonText}
            </Button>
          </Box>

          <AddEditEntityModal
            // entityType={entityType}
            selectedEntity={currentEntity}
            verbiage={verbiage}
            form={modalForm}
            modalDisclosure={{
              isOpen: addEditEntityModalIsOpen,
              onClose: closeAddEditEntityModal,
            }}
          />

          <DeleteEntityModal
            // entityType={entityType}
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
  dashboardBox: {
    textAlign: "center",
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
  emptyDashboard: {
    paddingTop: "1rem",
  },
  tableSeparator: {
    borderTop: "1px solid",
    borderColor: "palette.gray_light",
    paddingBottom: "1rem",
    marginTop: "1.25rem",
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
};
