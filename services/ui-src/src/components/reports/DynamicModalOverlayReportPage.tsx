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
  EntityShape,
  DynamicModalOverlayReportPageShape,
  ReportType,
} from "types";
// utils
import { parseCustomHtml, useBreakpoint, useStore } from "utils";
// verbiage
import alertVerbiage from "../../verbiage/pages/wp/wp-alerts";
import { getWPAlertStatus } from "../alerts/getWPAlertStatus";
import { AnyObject } from "yup/lib/types";

interface AlertVerbiage {
  [key: string]: { title: string; description: string };
}

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

  const showAlert =
    report && (alertVerbiage as AlertVerbiage)[entityType]
      ? getWPAlertStatus(report, entityType)
      : false;

  const dashTitle = `${verbiage.dashboardTitle}`;
  const dashSubTitle = parseCustomHtml(
    (verbiage as AnyObject)?.dashboardSubtitle
  );
  const tableHeaders = () => {
    if (isTablet || isMobile) return { headRow: ["", ""] };
    return { headRow: ["", verbiage.tableHeader, ""] };
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
    color: "palette.gray_medium",
    textAlign: "left",
    ".tablet &, .mobile &": {
      paddingBottom: "0",
    },
  },
  subsectionHeading: {
    fontSize: "md",
    fontWeight: "normal",
    color: "palette.gray_medium_dark",
    textAlign: "left",
    ".tablet &, .mobile &": {
      paddingBottom: "0",
    },
    paddingBottom: "1rem",
  },
  table: {
    tableLayout: "fixed",
    br: {
      marginBottom: "0.25rem",
    },
    th: {
      fontWeight: "bold",
      color: "palette.gray_medium",
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
};
