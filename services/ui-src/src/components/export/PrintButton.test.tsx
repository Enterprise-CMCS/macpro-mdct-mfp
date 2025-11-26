import { render, screen } from "@testing-library/react";
// components
import { PrintButton } from "./PrintButton";
// types
import { ReportStatus } from "types";
// utils
import { useStore } from "utils";
import { mockUseStore, RouterWrappedComponent } from "utils/testing/setupJest";
import {
  mockWPApprovedFullReport,
  mockWPFullReport,
} from "utils/testing/mockReport";
import { testA11yAct } from "utils/testing/commonTests";

jest.mock("utils/state/useStore");

const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const wpSubmittedContext = {
  report: {
    ...mockWPFullReport,
    status: ReportStatus.SUBMITTED,
  },
};

const mockSubmittedReportStore = {
  ...mockUseStore,
  ...wpSubmittedContext,
};

const mockApprovedReportStore = {
  ...mockUseStore,
  report: {
    ...mockWPApprovedFullReport,
  },
};

const PrintButtonComponent = () => {
  return (
    <RouterWrappedComponent>
      <PrintButton />
    </RouterWrappedComponent>
  );
};

describe("<PrintButton />", () => {
  test("check text when not submitted", () => {
    mockedUseStore.mockReturnValue(mockUseStore);
    render(PrintButtonComponent());
    expect(screen.getByText("Review PDF")).toBeVisible();
  });

  test("check text when submitted", () => {
    mockedUseStore.mockReturnValue(mockSubmittedReportStore);
    render(PrintButtonComponent());
    expect(screen.getByText("Download PDF")).toBeVisible();
  });

  test("check text when approved", () => {
    mockedUseStore.mockReturnValue(mockApprovedReportStore);
    render(PrintButtonComponent());
    expect(screen.getByText("Download PDF")).toBeVisible();
  });

  testA11yAct(PrintButtonComponent(), () => {
    mockedUseStore.mockReturnValue(mockUseStore);
  });
});
