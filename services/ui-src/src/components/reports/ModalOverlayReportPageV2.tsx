import { useState } from "react";
// components
import { Box, Button, Heading, useDisclosure, Image } from "@chakra-ui/react";
import {
  AddEditEntityModal,
  Alert,
  DeleteEntityModal,
  EntityRow,
  ReportPageFooter,
  ReportPageIntro,
  Table,
} from "components";
// types
import {
  AlertTypes,
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

export const ModalOverlayReportPageV2 = ({
  route,
  setSidebarHidden,
}: Props) => {
  // Route Information
  const { entityInfo, entityType, modalForm, verbiage } = route;
  // Context Information
  const { isMobile, isTablet } = useBreakpoint();
  const { clearSelectedEntity, report, selectedEntity, setSelectedEntity } =
    useStore();
  const [isEntityDetailsOpen, setIsEntityDetailsOpen] = useState<boolean>();

  // Display route
  let reportFieldDataEntities = report?.fieldData[entityType] || [];

  reportFieldDataEntities.map(
    (entity: EntityShape) => (entity.isOtherEntity = true)
  );

  if (report?.reportType === ReportType.SAR) {
    reportFieldDataEntities.map(
      (entity: EntityShape) => (entity.isCopied = true)
    );
  }

  const { alertsVerbiage } = getReportVerbiage(report?.reportType);
  const errorMessage: ErrorVerbiage =
    alertsVerbiage[entityType as keyof typeof alertsVerbiage];
  const showAlert =
    report && errorMessage ? getWPAlertStatus(report, entityType) : false;

  const hasEntities = reportFieldDataEntities.length > 0;
  let dashTitle = verbiage.dashboardTitle;
  if (hasEntities) {
    dashTitle += ` ${reportFieldDataEntities.length}`;
  }
  const dashSubTitle = verbiage.dashboardSubtitle;

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

  const TablePage = () => {
    return (
      <Box sx={sx.content}>
        <ReportPageIntro text={verbiage.intro} accordion={verbiage.accordion} />
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
          {hasEntities ? (
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
          ) : (
            <Box>{verbiage.emptyDashboardText}</Box>
          )}
          <Button
            sx={sx.addEntityButton}
            onClick={() => openAddEditEntityModal()}
            leftIcon={<Image src={addIcon} alt="Previous" sx={sx.addIcon} />}
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
          setError={() => {}}
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
    );
  };

  const DetailsOverlay = () => {
    return (
      <Button variant="unstyled" onClick={closeEntityDetailsOverlay}>
        Return to all initiatives
      </Button>
    );
  };

  return isEntityDetailsOpen ? <DetailsOverlay /> : <TablePage />;
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
