// components
import { Box } from "@chakra-ui/react";
import {
  ExportedModalDrawerReportSection,
  ExportedReportFieldTable,
  ExportedModalOverlayReportSection,
  ExportRETTable,
} from "components";
// types
import {
  DrawerReportPageShape,
  HeadingLevel,
  ModalDrawerReportPageShape,
  ModalOverlayReportPageShape,
  OverlayModalPageShape,
  PageTypes,
  ReportPageShapeBase,
  ReportRouteWithForm,
  StandardReportPageShape,
} from "types";
import { ExportedOverlayModalReportSection } from "./ExportedOverlayModalReportSection";
export const ExportedReportWrapper = ({
  section,
  headingLevel = "h2",
}: Props) => {
  switch (section.pageType) {
    case PageTypes.STANDARD:
      if (section.path.includes("/sar/recruitment-enrollment-transitions/")) {
        return (
          <ExportRETTable
            section={section as ReportPageShapeBase}
          ></ExportRETTable>
        );
      }
      return (
        <Box data-testid="exportedStandardReportSection" mt="2rem">
          <ExportedReportFieldTable
            section={section as StandardReportPageShape}
            headingLevel={headingLevel}
          />
        </Box>
      );
    case PageTypes.DRAWER:
      return (
        <Box data-testid="exportedDrawerReportSection" mt="2rem">
          <ExportedReportFieldTable
            section={section as DrawerReportPageShape}
            headingLevel={headingLevel}
          />
        </Box>
      );
    case PageTypes.MODAL_DRAWER:
      return (
        <ExportedModalDrawerReportSection
          section={section as ModalDrawerReportPageShape}
          headingLevel={headingLevel}
        />
      );
    case PageTypes.DYNAMIC_MODAL_OVERLAY:
    case PageTypes.MODAL_OVERLAY:
      return (
        <>
          <ExportedModalOverlayReportSection
            section={section as ModalOverlayReportPageShape}
            headingLevel={headingLevel}
          />
        </>
      );
    case PageTypes.OVERLAY_MODAL:
      return (
        <>
          <ExportedOverlayModalReportSection
            section={section as OverlayModalPageShape}
            headingLevel={headingLevel}
          />
        </>
      );
    default:
      return <></>;
  }
};

export interface Props {
  section: ReportRouteWithForm;
  headingLevel: HeadingLevel;
}
