import { ComponentClass, useContext, useEffect, useState } from "react";
import { Helmet as HelmetImport, HelmetProps } from "react-helmet";
// components
import { Box, Heading } from "@chakra-ui/react";
import {
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
  AnyObject,
  DynamicModalOverlayReportPageShape,
  EntityShape,
  FormJson,
  ReportShape,
  ReportStatus,
} from "types";
// utils
import {
  entityWasUpdated,
  filterFormData,
  getEntriesToClear,
  getPageTitle,
  isFieldElement,
  isTableField,
  parseCustomHtml,
  setClearedEntriesToDefaultValue,
  useBreakpoint,
  useStore,
} from "utils";

export const DynamicModalOverlayReportPageV2 = ({
  route,
  setSidebarHidden,
}: Props) => {
  const Helmet = HelmetImport as ComponentClass<HelmetProps>;

  // Route Information
  const { entityInfo, entityType, overlayForm, verbiage } = route;

  // Context Information
  const { isTablet, isMobile } = useBreakpoint();
  const { updateReport } = useContext(ReportContext);
  const [isEntityDetailsOpen, setIsEntityDetailsOpen] = useState<boolean>();
  const [entering, setEntering] = useState<boolean>(false);
  const [form, setForm] = useState<FormJson>({} as FormJson);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // State management
  const { full_name, state, userIsAdmin, userIsEndUser, userIsReadOnly } =
    useStore().user ?? {};
  const {
    editable,
    report = {} as ReportShape,
    selectedEntity,
    setSelectedEntity,
  } = useStore();
  const isDisabled = Boolean(userIsAdmin || userIsReadOnly || !editable);

  // Display Variables
  const reportFieldDataEntities = report?.fieldData[entityType] || [];
  const dashTitle = verbiage.dashboardTitle;
  const dashSubTitle = verbiage.dashboardSubtitle;

  const tableHeaders = () => {
    if (isTablet || isMobile) return { headRow: ["", ""] };
    return { headRow: ["", verbiage.tableHeader] };
  };

  // Open/Close overlay action methods
  const openEntityDetailsOverlay = (entity: EntityShape) => {
    window.scrollTo(0, 0);
    setSelectedEntity(entity);
    setIsEntityDetailsOpen(true);
    setSidebarHidden(true);
  };

  const closeEntityDetailsOverlay = () => {
    window.scrollTo(0, 0);
    setSelectedEntity(undefined);
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
        (entity: EntityShape) => entity.id === selectedEntity?.id
      );
      const nonTableFields = form.fields
        .filter(isFieldElement)
        .filter((f) => !isTableField(f));
      const filteredFormData = filterFormData(enteredData, nonTableFields);
      const entriesToClear = getEntriesToClear(enteredData, nonTableFields);
      const newEntity = {
        ...currentEntities[selectedEntityIndex],
        ...filteredFormData,
      };
      const newEntities = currentEntities;
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
    if (overlayForm) setForm(overlayForm);
  }, [overlayForm]);

  const tablePage = () => {
    return (
      <Box sx={sx.content}>
        {/* page title */}
        <Helmet>
          <title>{report && getPageTitle(report.reportType, route.name)}</title>
        </Helmet>
        <ReportPageIntro accordion={verbiage.accordion} text={verbiage.intro} />
        <Heading as="h3" sx={sx.dashboardTitle}>
          {dashTitle}
        </Heading>
        {dashSubTitle && (
          <Heading as="h2" sx={sx.subsectionHeading}>
            {parseCustomHtml(dashSubTitle)}
          </Heading>
        )}
        <Table content={tableHeaders()} sx={sx.table}>
          {reportFieldDataEntities.map((entity: EntityShape) => (
            <EntityRow
              entering={entering}
              entity={entity}
              entityInfo={entityInfo}
              entityType={entityType}
              key={entity.id}
              openOverlayOrDrawer={openEntityDetailsOverlay}
              showEntityCloseoutDetails={true}
              verbiage={verbiage}
            />
          ))}
        </Table>
        <ReportPageFooter verbiage={verbiage} />
      </Box>
    );
  };

  const detailsOverlay = () => {
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
          selectedEntity={selectedEntity}
          submitting={submitting}
          setEntering={setEntering}
          validateOnRender={false}
        />
      </EntityProvider>
    );
  };

  return isEntityDetailsOpen ? detailsOverlay() : tablePage();
};

interface Props {
  route: DynamicModalOverlayReportPageShape;
  setSidebarHidden: Function;
  validateOnRender?: boolean;
}

const sx = {
  backButton: {
    padding: 0,
    fontWeight: "normal",
    color: "primary",
    display: "flex",
    position: "relative",
    right: 0,
    ".tablet &": {
      right: "spacer6",
    },
    marginBottom: "spacer4",
    marginTop: "-2rem",
  },
  backIcon: {
    color: "primary",
    height: "1rem",
  },
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
      "&:last-of-type": {
        td: {
          border: "0",
        },
      },
    },
  },
};
