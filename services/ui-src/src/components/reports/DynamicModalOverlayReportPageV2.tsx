import { useState } from "react";
// components
import { Box, Button, Heading, Image } from "@chakra-ui/react";
import {
  EntityRow,
  ReportPageFooter,
  ReportPageIntro,
  Table,
} from "components";
// types
import { EntityShape, DynamicModalOverlayReportPageShape } from "types";
// utils
import { parseCustomHtml, useBreakpoint, useStore } from "utils";
// assets
import arrowLeftBlue from "assets/icons/icon_arrow_left_blue.png";

export const DynamicModalOverlayReportPageV2 = ({
  route,
  setSidebarHidden,
}: Props) => {
  // Route Information
  const { entityInfo, entityType, verbiage } = route;
  // Context Information
  const { isTablet, isMobile } = useBreakpoint();
  const [isEntityDetailsOpen, setIsEntityDetailsOpen] = useState<boolean>();
  const [currentEntity, setCurrentEntity] = useState<EntityShape | undefined>(
    undefined
  );

  // State management
  const { report } = useStore();

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
      <Box>
        <Button
          leftIcon={<Image sx={sx.backIcon} src={arrowLeftBlue} alt="" />}
          sx={sx.backButton}
          variant="none"
          onClick={() => closeEntityDetailsOverlay()}
          aria-label={"Return to all initiatives"}
        >
          Return to all initiatives
        </Button>
        <ReportPageIntro
          initiativeName={currentEntity?.initiative_name}
          text={{
            section: route.name,
          }}
        />
      </Box>
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
      borderBottom: "1px solid",
      borderColor: "gray_light",
      /**
       * removes bottom border only for
       * State or Territory-Specific Initiatives
       */
      "&:last-of-type": {
        td: {
          border: "none",
        },
      },
    },
  },
};
