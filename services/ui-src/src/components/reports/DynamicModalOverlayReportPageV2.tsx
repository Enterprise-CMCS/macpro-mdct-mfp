import { useState } from "react";
// components
import { Box, Heading } from "@chakra-ui/react";
import {
  EntityDetailsOverlayV2,
  EntityProvider,
  EntityRow,
  ReportPageFooter,
  ReportPageIntro,
  Table,
} from "components";
// types
import {
  AnyObject,
  DynamicModalOverlayReportPageShape,
  EntityShape,
  ReportShape,
} from "types";
// utils
import { parseCustomHtml, useBreakpoint, useStore } from "utils";

export const DynamicModalOverlayReportPageV2 = ({
  route,
  setSidebarHidden,
}: Props) => {
  // Route Information
  const { entityInfo, entityType, overlayForm, verbiage } = route;

  // Context Information
  const { isTablet, isMobile } = useBreakpoint();
  const [isEntityDetailsOpen, setIsEntityDetailsOpen] = useState<boolean>();
  const [currentEntity, setCurrentEntity] = useState<EntityShape | undefined>(
    undefined
  );
  const [entering, setEntering] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // State management
  const { userIsAdmin, userIsReadOnly } = useStore().user ?? {};
  const {
    editable,
    report = {} as ReportShape,
    setSelectedEntity,
  } = useStore();
  const isDisabled = Boolean(userIsAdmin || userIsReadOnly);

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

  const onSubmit = async (_enteredData: AnyObject) => {
    // TODO: Add updateReport settings
    setSubmitting(false);
    closeEntityDetailsOverlay();
    setSidebarHidden(false);
  };

  const tablePage = () => {
    return (
      <Box sx={sx.content}>
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
          form={overlayForm}
          onSubmit={onSubmit}
          route={route}
          selectedEntity={currentEntity}
          setSelectedEntity={setSelectedEntity}
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
