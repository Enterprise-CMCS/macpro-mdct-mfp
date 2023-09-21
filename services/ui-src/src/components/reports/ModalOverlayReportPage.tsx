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
  EntityType,
  ModalOverlayReportPageShape,
  EntityDetailsDashboardOverlayShape,
} from "types";
// utils
import { useBreakpoint, useStore } from "utils";
// verbiage
import alertVerbiage from "../../verbiage/pages/wp/wp-alerts";
// assets
import addIcon from "assets/icons/icon_add_white.png";

interface AlertVerbiage {
  [key: string]: { title: string; description: string };
}

export const ModalOverlayReportPage = ({ route, setSidebarHidden }: Props) => {
  // Route Information
  const { entityType, verbiage, modalForm, dashboard } = route;
  // Context Information
  const { isTablet, isMobile } = useBreakpoint();
  const { report } = useStore();
  const [isEntityDetailsOpen, setIsEntityDetailsOpen] = useState<boolean>();
  const [currentEntity, setCurrentEntity] = useState<EntityShape | undefined>(
    undefined
  );
  // const [submitting, setSubmitting] = useState<boolean>(false);

  // const { userIsEndUser } = useStore().user ?? {};

  // Determine whether form is locked or unlocked based on user and route
  const isLocked = report?.locked;

  // Display Variables
  let reportFieldDataEntities = report?.fieldData[entityType] || [];

  ///TEMPORARY ENTITY//
  let tempEntity: EntityShape = {
    name: "Your initiative one",
    id: "test-id",
    report_initiative: "Transitions and transition coordination services",
    isOtherEntity: true,
  };
  reportFieldDataEntities = [tempEntity, tempEntity];
  //////////////////////

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

  return (
    <Box>
      {dashboard && isEntityDetailsOpen && currentEntity ? (
        <EntityProvider>
          <EntityDetailsDashboardOverlay
            entityType={entityType as EntityType}
            dashboard={dashboard}
            selectedEntity={currentEntity}
            route={route as EntityDetailsDashboardOverlayShape}
          />
        </EntityProvider>
      ) : (
        <Box sx={sx.content}>
          <ReportPageIntro
            text={verbiage.intro}
            reportType={report?.reportType}
          />
          {(alertVerbiage as AlertVerbiage)[route.entityType] && (
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
              <>
                <Box sx={sx.tableSeparator} />
                <Box sx={sx.emptyDashboard}>{verbiage.emptyDashboardText}</Box>
              </>
            ) : (
              <Table sx={sx.table} content={tableHeaders()}>
                {reportFieldDataEntities.map((entity: EntityShape) => (
                  <EntityRow
                    key={entity.id}
                    entity={entity}
                    verbiage={verbiage}
                    locked={isLocked}
                    openDrawer={openEntityDetailsOverlay}
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
  addIcon: {
    width: "1rem",
  },
};
