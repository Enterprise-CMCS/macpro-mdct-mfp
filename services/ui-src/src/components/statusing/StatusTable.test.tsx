import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { StatusTable } from "components";
// types
import { ReportStatus, ReportType } from "types";
// utils
import {
  mockReportStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { makeMediaQueryClasses, useBreakpoint, useStore } from "utils";
import userEvent from "@testing-library/user-event";
import { StatusIcon } from "./StatusTable";

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
}));

jest.mock("utils/other/useBreakpoint");
const mockUseBreakpoint = useBreakpoint as jest.MockedFunction<
  typeof useBreakpoint
>;

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const mockMakeMediaQueryClasses = makeMediaQueryClasses as jest.MockedFunction<
  typeof makeMediaQueryClasses
>;

const mockNoReport = { ...mockReportStore, report: undefined };

const mockInProgressReport = {
  ...mockReportStore,
  report: {
    ...mockReportStore.report,
    status: ReportStatus.IN_PROGRESS,
  },
};

const StatusTableComponent = (
  <RouterWrappedComponent>
    <StatusTable />
  </RouterWrappedComponent>
);

describe("Status Table Functionality", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should not display anything if not given a report", () => {
    mockUseBreakpoint.mockReturnValue({
      isMobile: false,
    });
    mockMakeMediaQueryClasses.mockReturnValue("desktop");
    mockedUseStore.mockReturnValue(mockNoReport);
    render(StatusTableComponent);
    expect(screen.queryByText("Section")).not.toBeInTheDocument();
    expect(screen.queryByText("Status")).not.toBeInTheDocument();
  });

  test("should show the correct headers when given a report", () => {
    mockUseBreakpoint.mockReturnValue({
      isMobile: false,
    });
    mockMakeMediaQueryClasses.mockReturnValue("desktop");
    mockedUseStore.mockReturnValue(mockInProgressReport);
    render(StatusTableComponent);
    expect(screen.getByText("Section")).toBeVisible();
    expect(screen.getByText("Status")).toBeVisible();
  });

  test("Should correctly display errors on the page", () => {
    mockUseBreakpoint.mockReturnValue({
      isMobile: false,
    });
    mockMakeMediaQueryClasses.mockReturnValue("desktop");
    mockedUseStore.mockReturnValue(mockInProgressReport);
    render(StatusTableComponent);
    const unfilledPageErrorImg = document.querySelectorAll(
      "img[alt='Error notification']"
    );
    expect(unfilledPageErrorImg).toHaveLength(1);
    expect(unfilledPageErrorImg[0]).toBeVisible();
  });

  test("should show the correct rows on the page", () => {
    mockUseBreakpoint.mockReturnValue({
      isMobile: false,
    });
    mockMakeMediaQueryClasses.mockReturnValue("desktop");
    mockedUseStore.mockReturnValue(mockInProgressReport);
    render(StatusTableComponent);
    expect(screen.getByText("mock-route-1")).toBeVisible();

    expect(screen.getByText("mock-route-2")).toBeVisible();
    expect(screen.getByText("mock-route-2a")).toBeVisible();
    const unfilledPageErrorImg = document.querySelectorAll(
      "img[alt='Error notification']"
    );
    expect(unfilledPageErrorImg).toHaveLength(1);
    expect(unfilledPageErrorImg[0]).toBeVisible();
    expect(screen.getByText("mock-route-2b")).toBeVisible();

    // Name value is the img's alt tag + the text inside the button
    const editButtons = screen.getAllByRole("button");
    expect(editButtons).toHaveLength(5);
  });

  test("should be able to navigate to a page on the form by clicking edit on desktop", async () => {
    mockUseBreakpoint.mockReturnValue({
      isMobile: false,
    });
    mockMakeMediaQueryClasses.mockReturnValue("desktop");
    mockedUseStore.mockReturnValue(mockInProgressReport);
    render(StatusTableComponent);
    // Name value is the img's alt tag + the text inside the button
    const editButtons = screen.getAllByRole("button");
    expect(editButtons).toHaveLength(5);

    await userEvent.click(editButtons[0]);
    const validateOnRenderProp = { state: { validateOnRender: true } };
    const expectedRoute1 = "/mock/mock-route-1";
    expect(mockUseNavigate).toHaveBeenCalledWith(
      expectedRoute1,
      validateOnRenderProp
    );

    await userEvent.click(editButtons[1]);
    const expectedRoute2 = "/mock/mock-route-2a";
    expect(mockUseNavigate).toHaveBeenCalledWith(
      expectedRoute2,
      validateOnRenderProp
    );

    await userEvent.click(editButtons[2]);
    const expectedRoute3 = "/mock/mock-route-2b";
    expect(mockUseNavigate).toHaveBeenCalledWith(
      expectedRoute3,
      validateOnRenderProp
    );
  });

  test("should be able to navigate to a page on the form by clicking edit on mobile", async () => {
    mockUseBreakpoint.mockReturnValue({
      isMobile: true,
    });
    mockMakeMediaQueryClasses.mockReturnValue("mobile");
    mockedUseStore.mockReturnValue(mockInProgressReport);
    render(StatusTableComponent);
    // Name value is the img's alt tag + the text inside the button
    const editButtons = screen.getAllByRole("button");
    expect(editButtons).toHaveLength(5);

    await userEvent.click(editButtons[0]);
    const validateOnRenderProp = { state: { validateOnRender: true } };
    const expectedRoute1 = "/mock/mock-route-1";
    expect(mockUseNavigate).toHaveBeenCalledWith(
      expectedRoute1,
      validateOnRenderProp
    );

    await userEvent.click(editButtons[1]);
    const expectedRoute2 = "/mock/mock-route-2a";
    expect(mockUseNavigate).toHaveBeenCalledWith(
      expectedRoute2,
      validateOnRenderProp
    );

    await userEvent.click(editButtons[2]);
    const expectedRoute3 = "/mock/mock-route-2b";
    expect(mockUseNavigate).toHaveBeenCalledWith(
      expectedRoute3,
      validateOnRenderProp
    );
  });
});

describe("Status Table Accessibility", () => {
  beforeEach(async () => {
    mockUseBreakpoint.mockReturnValue({
      isMobile: false,
    });
    mockMakeMediaQueryClasses.mockReturnValue("desktop");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should not have basic accessibility issues when displaying the table", async () => {
    mockedUseStore.mockReturnValue(mockInProgressReport);
    const { container } = render(StatusTableComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("StatusIcon functionality", () => {
  it("should render the correct status for complete SAR rows", () => {
    const { container } = render(
      <StatusIcon reportType={ReportType.SAR} status={true} />
    );
    const errorImages = container.querySelectorAll(
      "img[alt='Error notification']"
    );
    const successImages = container.querySelectorAll(
      "img[alt='Success notification']"
    );
    expect(successImages).toHaveLength(1);
    expect(successImages[0]).toBeVisible();
    expect(errorImages).toHaveLength(0);
  });
  it("should render the correct status for incomplete SAR rows", () => {
    const { container } = render(
      <StatusIcon reportType={ReportType.SAR} status={false} />
    );
    const errorImages = container.querySelectorAll(
      "img[alt='Error notification']"
    );
    const successImages = container.querySelectorAll(
      "img[alt='Success notification']"
    );
    expect(errorImages).toHaveLength(1);
    expect(errorImages[0]).toBeVisible();
    expect(successImages).toHaveLength(0);
  });
  it("should render the correct status for complete WP rows", () => {
    const { container } = render(
      <StatusIcon reportType={ReportType.WP} status={true} />
    );
    const errorImages = container.querySelectorAll(
      "img[alt='Error notification']"
    );
    const successImages = container.querySelectorAll(
      "img[alt='Success notification']"
    );
    expect(successImages).toHaveLength(1);
    expect(errorImages).toHaveLength(0);
  });
  it("should render the correct status for incomplete WP rows", () => {
    const { container } = render(
      <StatusIcon reportType={ReportType.WP} status={false} />
    );
    const errorImages = container.querySelectorAll(
      "img[alt='Error notification']"
    );
    const successImages = container.querySelectorAll(
      "img[alt='Success notification']"
    );
    expect(errorImages).toHaveLength(1);
    expect(errorImages[0]).toBeVisible();
    expect(successImages).toHaveLength(0);
  });
  it("should raise an error if you try to use an invalid report type", () => {
    expect(() => {
      render(
        <StatusIcon
          reportType={"invalidReportType" as ReportType}
          status={false}
        />
      );
    }).toThrowError(
      "Statusing icons for 'invalidReportType' have not been implemented."
    );
  });
});
