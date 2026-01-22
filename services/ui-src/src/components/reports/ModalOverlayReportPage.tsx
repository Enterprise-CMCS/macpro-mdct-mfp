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
  AnyObject,
  EntityShape,
  ErrorVerbiage,
  ModalOverlayReportPageShape,
  ReportType,
} from "types";
// utils
import {
  getReportVerbiage,
  resetClearProp,
  useBreakpoint,
  useStore,
} from "utils";
import { getWPAlertStatus } from "../alerts/getWPAlertStatus";
// assets
import addIcon from "assets/icons/icon_add_white.png";

export const ModalOverlayReportPage = ({ route, setSidebarHidden }: Props) => {
  // Route Information
  const { entityType, verbiage, modalForm, dashboard, entityInfo } = route;
  // Context Information
  const { isTablet, isMobile } = useBreakpoint();
  const { report, selectedEntity, setSelectedEntity, clearSelectedEntity } =
    useStore();
  const [isEntityDetailsOpen, setIsEntityDetailsOpen] = useState<boolean>();

  // Display Variables
  let reportFieldDataEntities = report?.fieldData[entityType] || [];

  (reportFieldDataEntities as any[]).map(
    (entity) => (entity["isOtherEntity"] = true)
  );

  if (report?.reportType === ReportType.SAR) {
    (reportFieldDataEntities as any[]).map(
      (entity) => (entity["isCopied"] = true)
    );
  }

  const { alertsVerbiage } = getReportVerbiage(report?.reportType);
  const errorMessage: ErrorVerbiage =
    alertsVerbiage[entityType as keyof typeof alertsVerbiage];
  const showAlert =
    report && errorMessage ? getWPAlertStatus(report, entityType) : false;
  const dashTitle = `${verbiage.dashboardTitle} ${
    modalForm ? reportFieldDataEntities.length : ""
  }`;
  const dashSubTitle = (verbiage as AnyObject)?.dashboardSubtitle;
  const tableHeaders = () => {
    if (isTablet || isMobile) return { headRow: ["", ""] };
    return { headRow: ["", verbiage.tableHeader] };
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
            entitySteps={route.entitySteps}
          />
        </EntityProvider>
      ) : (
        <Box sx={sx.content}>
          <ReportPageIntro
            text={verbiage.intro}
            accordion={verbiage.accordion}
          />
          {showAlert && (
            <Alert
              title={errorMessage.title}
              status={AlertTypes.ERROR}
              description={errorMessage.description}
            />
          )}
          <Box>
            <Heading as="h3" sx={sx.dashboardTitle}>
              {dashTitle}
            </Heading>
            <Heading as="h2" sx={sx.subsectionHeading}>
              {dashSubTitle}
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
                    showEntityCloseoutDetails={true}
                    openOverlayOrDrawer={openEntityDetailsOverlay}
                    openAddEditEntityModal={openAddEditEntityModal}
                    openDeleteEntityModal={openDeleteEntityModal}
                  />
                ))}
              </Table>
            )}
            {modalForm && (
              <Button
                sx={sx.addEntityButton}
                onClick={() => openAddEditEntityModal()}
                leftIcon={
                  <Image src={addIcon} alt="Previous" sx={sx.addIcon} />
                }
              >
                {verbiage.addEntityButtonText}
              </Button>
            )}
          </Box>
          {/* Modals */}
          {modalForm && (
            <AddEditEntityModal
              entityType={entityType}
              selectedEntity={selectedEntity}
              verbiage={verbiage}
              form={modalForm}
              setError={() => {}}
              modalDisclosure={{
                isOpen: addEditEntityModalIsOpen,
                onClose: closeAddEditEntityModal,
              }}
            />
          )}
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
    marginTop: "spacer2",
    fontSize: "md",
    fontWeight: "bold",
    color: "gray",
    textAlign: "left",
    ".tablet &, .mobile &": {
      paddingBottom: "0",
    },
  },
  subsectionHeading: {
    fontSize: "md",
    fontWeight: "normal",
    color: "gray_dark",
    textAlign: "left",
    ".tablet &, .mobile &": {
      paddingBottom: "0",
    },
    paddingBottom: "spacer2",
  },
  table: {
    tableLayout: "fixed",
    br: {
      marginBottom: "spacer_half",
    },
    th: {
      fontWeight: "bold",
      color: "gray",
      paddingLeft: "spacer2",
      paddingRight: "0",
      borderBottom: "1px solid",
      borderColor: "gray_light",
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
    tr: {
      borderBottom: "1px solid",
      borderColor: "gray_light",
    },
  },
  addEntityButton: {
    marginTop: "spacer4",
    ".tablet &, .mobile &": {
      wordBreak: "break-word",
      whiteSpace: "break-spaces",
    },
  },
  addIcon: {
    width: "1rem",
  },
};
