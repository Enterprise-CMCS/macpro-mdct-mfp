import { useState } from "react";
// components
import { Box, Button, Heading, useDisclosure, Image } from "@chakra-ui/react";
import {
  AddEditEntityModal,
  Alert,
  DeleteEntityModal,
  EntityDetailsDashboardOverlay,
  EntityProvider,
  EntityRow,
  ReportPageFooter,
  ReportPageIntro,
  Table,
} from "components";
// types
import {
  AlertTypes,
  EntityShape,
  ModalOverlayReportPageShape,
  EntityDetailsDashboardOverlayShape,
} from "types";
// utils
import { resetClearProp, useBreakpoint, useStore } from "utils";
// verbiage
import alertVerbiage from "../../verbiage/pages/wp/wp-alerts";
// assets
import addIcon from "assets/icons/icon_add_white.png";
import { getWPAlertStatus } from "../alerts/getWPAlertStatus";

interface AlertVerbiage {
  [key: string]: { title: string; description: string };
}

export const ModalOverlayReportPage = ({ route, setSidebarHidden }: Props) => {
  // Route Information
  const { entityType, verbiage, modalForm, dashboard, entityInfo } = route;
  // Context Information
  const { isTablet, isMobile } = useBreakpoint();
  const { report, selectedEntity, setSelectedEntity, clearSelectedEntity } =
    useStore();
  const [isEntityDetailsOpen, setIsEntityDetailsOpen] = useState<boolean>();

  // Determine whether form is locked or unlocked based on user and route
  const isLocked = report?.locked;

  // Display Variables
  let reportFieldDataEntities = report?.fieldData[entityType] || [];

  (reportFieldDataEntities as any[]).map(
    (entity) => (entity["isOtherEntity"] = true)
  );

  const showAlert =
    report && (alertVerbiage as AlertVerbiage)[entityType]
      ? getWPAlertStatus(report, entityType)
      : false;

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
    if (entity) setSelectedEntity(entity);
    addEditEntityModalOnOpenHandler();
  };

  const closeAddEditEntityModal = () => {
    clearSelectedEntity();
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
    setSelectedEntity(entity);
    deleteEntityModalOnOpenHandler();
  };

  const closeDeleteEntityModal = () => {
    clearSelectedEntity();
    deleteEntityModalOnCloseHandler();
  };

  // Open/Close overlay action methods
  const openEntityDetailsOverlay = (entity: EntityShape) => {
    setSelectedEntity(entity);
    setIsEntityDetailsOpen(true);
    setSidebarHidden(true);
  };

  const closeEntityDetailsOverlay = () => {
    clearSelectedEntity();
    setIsEntityDetailsOpen(false);
    setSidebarHidden(false);
  };

  return (
    <Box>
      {dashboard && isEntityDetailsOpen && selectedEntity ? (
        <EntityProvider>
          <EntityDetailsDashboardOverlay
            closeEntityDetailsOverlay={closeEntityDetailsOverlay}
            dashboard={dashboard}
            selectedEntity={selectedEntity}
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
            selectedEntity={selectedEntity}
            verbiage={verbiage}
            form={modalForm}
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
          <ReportPageFooter verbiage={verbiage} />
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
