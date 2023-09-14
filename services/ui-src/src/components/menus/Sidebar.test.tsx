import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  RouterWrappedComponent,
  mockReportStore,
} from "utils/testing/setupJest";
import { axe } from "jest-axe";
//components
import { Sidebar } from "components";
import { useStore } from "utils";

jest.mock("utils/reports/routing", () => ({
  isReportFormPage: jest.fn(() => true),
}));

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const sidebarComponent = (
  <RouterWrappedComponent>
    <Sidebar isHidden={false} />
  </RouterWrappedComponent>
);

const sidebarComponentHidden = (
  <RouterWrappedComponent>
    <Sidebar isHidden={true} />
  </RouterWrappedComponent>
);

describe("Test Sidebar", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockReportStore);
    render(sidebarComponent);
  });

  test("Sidebar menu is visible", () => {
    const reportName = mockReportStore.report
      ? mockReportStore.report.formTemplate.name
      : "";
    expect(screen.getByText(reportName)).toBeVisible();
  });

  test("Sidebar button click opens and closes sidebar", async () => {
    // note: tests sidebar nav at non-desktop size, so it is closed to start
    const sidebarNav = screen.getByRole("navigation");
    expect(sidebarNav).toHaveClass("closed");

    const sidebarButton = screen.getByLabelText("Open/Close sidebar menu");
    await userEvent.click(sidebarButton);
    expect(sidebarNav).toHaveClass("open");
  });

  test("Sidebar section click opens and closes section", async () => {
    const parentSection = screen.getByText("mock-route-2");
    const childSection = screen.getByText("mock-route-2a");

    // child section is not visible to start
    expect(childSection).not.toBeVisible();

    // click parent section open. now child is visible.
    await userEvent.click(parentSection);
    await expect(childSection).toBeVisible();

    // click parent section closed. now child is not visible.
    await userEvent.click(parentSection);
    await expect(childSection).not.toBeVisible();
  });
});

describe("Test Sidebar isHidden property", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockReportStore);
    render(sidebarComponentHidden);
  });
  test("If isHidden is true, Sidebar is invisible", () => {
    const reportName = mockReportStore.report
      ? mockReportStore.report.formTemplate.name
      : "";
    expect(screen.getByText(reportName)).not.toBeVisible();
  });
});

describe("Test Sidebar accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(sidebarComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
