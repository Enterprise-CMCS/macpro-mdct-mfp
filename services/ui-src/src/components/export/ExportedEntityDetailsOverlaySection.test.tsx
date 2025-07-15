// components
import { renderEntityDetailTables } from "./ExportedEntityDetailsOverlaySection";
// utils
import { useStore } from "../../utils";
import { mockUseStore } from "../../utils/testing/setupJest";
import {
  mockReportFieldData,
  mockWPFullReport,
} from "../../utils/testing/mockReport";
import { EntityShape } from "types";

jest.mock("utils/state/useStore");

const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockUseStore);

describe("<ExportedEntityDetailsOverlaySection />", () => {
  describe("renderEntityDetailTables()", () => {
    test("Returns error for unknown reportType", () => {
      const report = {
        ...mockWPFullReport,
        reportType: "UNKNOWN_TYPE",
      };
      const entities = mockReportFieldData.entityType as EntityShape[];
      const entityStep = ["mock-step"];
      const showHintText = false;
      const closed = false;
      const tableSection = undefined;
      const headingLevel = "h2";

      expect(() =>
        renderEntityDetailTables(
          report,
          entities[0],
          entityStep,
          showHintText,
          closed,
          tableSection,
          headingLevel
        )
      ).toThrow(
        "The entity detail table for report type 'UNKNOWN_TYPE' has not been implemented."
      );
    });
  });
});
