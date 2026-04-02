import { useContext, useEffect, useState } from "react";
// components
import { Box, Button, Heading, Image, useDisclosure } from "@chakra-ui/react";
import {
  AddEditEntityModal,
  Alert,
  DeleteEntityModal,
  EntityDetailsOverlayV2,
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
  ErrorVerbiage,
  FormJson,
  isFieldElement,
  ModalOverlayReportPageShape,
  ReportShape,
  ReportStatus,
  ReportType,
} from "types";
// utils
import {
  entityWasUpdated,
  filterFormData,
  getEntriesToClear,
  getReportVerbiage,
  resetClearProp,
  setClearedEntriesToDefaultValue,
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
  const { entityInfo, entityType, modalForm, overlayForm, verbiage } = route;
  // Context Information
  const { isMobile, isTablet } = useBreakpoint();
  const { updateReport } = useContext(ReportContext);
  const [isEntityDetailsOpen, setIsEntityDetailsOpen] = useState<boolean>();
  const [currentEntity, setCurrentEntity] = useState<EntityShape | undefined>(
    undefined
  );
  const [entering, setEntering] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [form, setForm] = useState<FormJson>({} as FormJson);

  // State management
  const { full_name, state, userIsAdmin, userIsEndUser, userIsReadOnly } =
    useStore().user ?? {};
  const { editable, report = {} as ReportShape } = useStore();
  const isDisabled = Boolean(userIsAdmin || userIsReadOnly);

  // Display route
  const reportFieldDataEntities = report?.fieldData[entityType] || [];

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
  const dashTitle = `${verbiage.dashboardTitle} ${reportFieldDataEntities.length}`;
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
    window.scrollTo(0, 0);
    setCurrentEntity(entity);
    setIsEntityDetailsOpen(true);
    setSidebarHidden(true);
  };

  const closeEntityDetailsOverlay = () => {
    window.scrollTo(0, 0);
    setCurrentEntity(undefined);
    setIsEntityDetailsOpen(false);
    setSidebarHidden(false);
  };

  const onSubmit = async (enteredData: AnyObject) => {
    if (userIsEndUser) {
      setSubmitting(true);
      const reportKeys = {
        reportType: report.reportType,
        state,
        id: report.id,
      };
      const currentEntities = [...(report.fieldData[entityType] || [])];
      const selectedEntityIndex = report.fieldData[entityType].findIndex(
        (entity: EntityShape) => entity.id === currentEntity?.id
      );
      const filteredFormData = filterFormData(
        enteredData,
        form.fields.filter(isFieldElement)
      );
      const entriesToClear = getEntriesToClear(
        enteredData,
        form.fields.filter(isFieldElement)
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

  useEffect(() => {
    const fields = report.isCopied
      ? overlayForm.fields
      : overlayForm.fields.filter((f) => !f.forCopyoverOnly);

    setForm({
      ...overlayForm,
      fields,
    });
  }, [overlayForm, report.isCopied]);

  const TablePage = () => {
    return (
      <Box sx={sx.content}>
        <ReportPageIntro accordion={verbiage.accordion} text={verbiage.intro} />
        {showAlert && (
          <Alert
            description={errorMessage.description}
            status={AlertTypes.ERROR}
            title={errorMessage.title}
          />
        )}
        <Heading as="h3" sx={sx.dashboardTitle}>
          {dashTitle}
        </Heading>
        <Heading as="h2" sx={sx.subsectionHeading}>
          {dashSubTitle}
        </Heading>
        {hasEntities ? (
          <Table content={tableHeaders()} sx={sx.table}>
            {reportFieldDataEntities.map((entity: EntityShape) => (
              <EntityRow
                entering={entering}
                entity={entity}
                entityInfo={entityInfo}
                entityType={entityType}
                key={entity.id}
                openAddEditEntityModal={openAddEditEntityModal}
                openDeleteEntityModal={openDeleteEntityModal}
                openOverlayOrDrawer={openEntityDetailsOverlay}
                showEntityCloseoutDetails={true}
                verbiage={verbiage}
              />
            ))}
          </Table>
        ) : (
          <Box>{verbiage.emptyDashboardText}</Box>
        )}
        <Button
          leftIcon={<Image src={addIcon} alt="Previous" sx={sx.addIcon} />}
          onClick={() => openAddEditEntityModal()}
          sx={sx.addEntityButton}
        >
          {verbiage.addEntityButtonText}
        </Button>
        {/* Modals */}
        <AddEditEntityModal
          entityType={entityType}
          form={modalForm}
          modalDisclosure={{
            isOpen: addEditEntityModalIsOpen,
            onClose: closeAddEditEntityModal,
          }}
          selectedEntity={currentEntity}
          setError={() => {}}
          verbiage={verbiage}
        />
        <DeleteEntityModal
          entityType={entityType}
          modalDisclosure={{
            isOpen: deleteEntityModalIsOpen,
            onClose: closeDeleteEntityModal,
          }}
          selectedEntity={currentEntity}
          verbiage={verbiage}
        />
        <ReportPageFooter verbiage={verbiage} />
      </Box>
    );
  };

  const DetailsOverlay = () => {
    return (
      <EntityProvider>
        <EntityDetailsOverlayV2
          backButtonText={verbiage.backButtonText}
          closeEntityDetailsOverlay={closeEntityDetailsOverlay}
          disabled={isDisabled}
          editable={editable}
          form={form}
          onSubmit={onSubmit}
          route={route}
          selectedEntity={currentEntity}
          submitting={submitting}
          setEntering={setEntering}
          validateOnRender={false}
        />
      </EntityProvider>
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
    color: "gray",
    fontSize: "md",
    fontWeight: "bold",
    marginTop: "spacer2",
    textAlign: "left",
    ".tablet &, .mobile &": {
      paddingBottom: "0",
    },
  },
  subsectionHeading: {
    color: "gray_dark",
    fontSize: "md",
    fontWeight: "normal",
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
      borderBottom: "1px solid",
      borderColor: "gray_light",
      color: "gray",
      fontWeight: "bold",
      paddingLeft: "spacer2",
      paddingRight: "0",
      ".tablet &, .mobile &": {
        border: "0",
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
      whiteSpace: "break-spaces",
      wordBreak: "break-word",
    },
  },
  addIcon: {
    width: "1rem",
  },
};
