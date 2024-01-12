// components
import { Box } from "@chakra-ui/react";
import {
  ExportedModalDrawerReportSection,
  ExportedReportFieldTable,
  ExportedModalOverlayReportSection,
  ExportRETTable
} from "components";
// types
import {
  DrawerReportPageShape,
  ModalDrawerReportPageShape,
  ModalOverlayReportPageShape,
  OverlayModalPageShape,
  PageTypes,
  ReportPageShapeBase,
  ReportRouteWithForm,
  StandardReportPageShape,
} from "types";
import { ExportedOverlayModalReportSection } from "./ExportedOverlayModalReportSection";

export const ExportedReportWrapper = ({ section }: Props) => {
  switch (section.pageType) {
    case PageTypes.STANDARD:
      if (section.path.includes("/sar/recruitment-enrollment-transitions/")) {
        return <ExportRETTable section={section as ReportPageShapeBase}></ExportRETTable>;
      }
      return (
        <Box data-testid="exportedStandardReportSection" mt="2rem">
          <ExportedReportFieldTable
            section={section as StandardReportPageShape}
          />
        </Box>
      );
    case PageTypes.DRAWER:
      return (
        <Box data-testid="exportedDrawerReportSection" mt="2rem">
          <ExportedReportFieldTable
            section={section as DrawerReportPageShape}
          />
        </Box>
      );
    case PageTypes.MODAL_DRAWER:
      return (
        <ExportedModalDrawerReportSection
          section={section as ModalDrawerReportPageShape}
        />
      );
    case PageTypes.MODAL_OVERLAY:
      return (
        <>
          <ExportedModalOverlayReportSection
            section={section as ModalOverlayReportPageShape}
          />
        </>
      );
    case PageTypes.OVERLAY_MODAL:
      return (
        <>
          <ExportedOverlayModalReportSection
            section={section as OverlayModalPageShape}
          />
        </>
      );
    default:
      return <></>;
  }
};

export interface Props {
  section: ReportRouteWithForm;
}
