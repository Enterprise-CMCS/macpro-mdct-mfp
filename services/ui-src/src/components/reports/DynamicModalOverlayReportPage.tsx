import { useState } from "react";
// components
import { Box, Heading } from "@chakra-ui/react";
import {
  Alert,
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
  DynamicModalOverlayReportPageShape,
  ReportType,
} from "types";
// utils
import {
  getReportVerbiage,
  parseCustomHtml,
  useBreakpoint,
  useStore,
} from "utils";
// verbiage
import { getWPAlertStatus } from "../alerts/getWPAlertStatus";

export const DynamicModalOverlayReportPage = ({
  route,
  setSidebarHidden,
}: Props) => {
  // Route Information
  const { entityType, verbiage, entityInfo, initiatives } = route;
  // Context Information
  const { isTablet, isMobile } = useBreakpoint();
  const { report, selectedEntity, setSelectedEntity, clearSelectedEntity } =
    useStore();
  const [isEntityDetailsOpen, setIsEntityDetailsOpen] = useState<boolean>();
  const [selectedInitiative, setSelectedInitiative] =
    useState<DynamicModalOverlayReportPageShape["initiatives"][number]>();

  if (!report) {
    throw new Error("Cannot render DynamicModalOverlayPage without a report");
  }

  // Display Variables
  let reportFieldDataEntities = (report?.fieldData[entityType] ||
    []) as EntityShape[];

  // TODO, do we need to set isCopied here, or is setting it in the API during the copy sufficient?
  if (
    report.reportType ===
    ReportType.SAR /* which it will be; only SAR has this page type */
  ) {
    for (let entity of reportFieldDataEntities) {
      entity.isCopied = true;
    }
  }

  const { alertsVerbiage } = getReportVerbiage(report.reportType);
  const errorMessage: ErrorVerbiage =
    alertsVerbiage[entityType as keyof typeof alertsVerbiage];

  const showAlert =
    report && errorMessage ? getWPAlertStatus(report, entityType) : false;
  const dashTitle = verbiage?.dashboardTitle;
  const dashSubTitle = parseCustomHtml(
    (verbiage as AnyObject)?.dashboardSubtitle
  );
  const tableHeaders = () => {
    if (isTablet || isMobile) return { headRow: ["", ""] };
    return { headRow: ["", verbiage.tableHeader] };
  };

  // Open/Close overlay action methods
  const openEntityDetailsOverlay = (entity: EntityShape) => {
    /*
     * Every entity in the field data has exactly one initiative in the form template,
     * and vice versa. So we can sure that this .find will succeed.
     */
    const initiative = initiatives.find(
      (init) => init.initiativeId === entity.id
    );
    setSelectedInitiative(initiative);
    setSelectedEntity(entity);
    setIsEntityDetailsOpen(true);
    setSidebarHidden(true);
  };

  const closeEntityDetailsOverlay = () => {
    setSelectedInitiative(undefined);
    clearSelectedEntity();
    setIsEntityDetailsOpen(false);
    setSidebarHidden(false);
  };

  return (
    <Box>
      {isEntityDetailsOpen && selectedEntity ? (
        <EntityProvider>
          <EntityDetailsDashboardOverlay
            closeEntityDetailsOverlay={closeEntityDetailsOverlay}
            dashboard={selectedInitiative?.dashboard}
            selectedEntity={selectedEntity}
            entitySteps={selectedInitiative?.entitySteps}
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
                {reportFieldDataEntities.map((entity, idx) => {
                  return (
                    <EntityRow
                      key={`entityRow-${idx}`}
                      entity={entity}
                      entityType={entityType}
                      entityInfo={entityInfo}
                      verbiage={verbiage}
                      showEntityCloseoutDetails={true}
                      openOverlayOrDrawer={openEntityDetailsOverlay}
                    />
                  );
                })}
              </Table>
            )}
          </Box>
          <ReportPageFooter verbiage={verbiage} />
        </Box>
      )}
    </Box>
  );
};

interface Props {
  route: DynamicModalOverlayReportPageShape;
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
      "&:nth-of-type(1)": {
        width: "2.5rem",
      },
      "&:nth-of-type(3)": {
        width: "260px",
      },
    },
    /**
     * removes bottom border only for
     * State or Territory-Specific Initiatives
     */
    tr: {
      "&:last-of-type": {
        td: {
          border: "none",
        },
      },
    },
  },
};
