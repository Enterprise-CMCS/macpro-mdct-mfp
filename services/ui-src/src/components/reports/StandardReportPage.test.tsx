import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import userEvent from "@testing-library/user-event";
// components
import { ReportContext, StandardReportPage } from "components";
// utils
import {
  mockForm,
  mockWpReportContext,
  mockStandardReportPageJson,
  RouterWrappedComponent,
  mockUseStore,
  mockWPFullReport,
  mockReportStore,
} from "utils/testing/setupJest";
import { useStore } from "utils/state/useStore";
import { ReportShape } from "types";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const mockReportStoreWithoutData = {
  ...mockUseStore,
  report: {
    ...(mockWPFullReport as ReportShape),
    fieldData: {},
  },
};

const standardPageSectionComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockWpReportContext}>
      <StandardReportPage
        route={{ ...mockStandardReportPageJson, form: mockForm }}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

global.structuredClone = jest.fn((val) => {
  return JSON.parse(JSON.stringify(val));
});

describe("Test StandardReportPage", () => {
  test("StandardReportPage view renders", () => {
    mockedUseStore.mockReturnValue(mockReportStore);
    render(standardPageSectionComponent);
    expect(
      screen.getByText(mockStandardReportPageJson.verbiage.intro.section)
    ).toBeVisible();
  });

  test("StandardReportPage correctly submits a valid form", async () => {
    mockedUseStore.mockReturnValue(mockReportStore);
    const result = render(standardPageSectionComponent);
    const textFieldInput: HTMLInputElement = result.container.querySelector(
      "[id='mock-text-field'"
    )!;
    await userEvent.type(textFieldInput, "ABC");
    expect(textFieldInput.value).toEqual("ABC");
    fireEvent.blur(textFieldInput);
    const continueButton = screen.getByText("Continue")!;
    await userEvent.click(continueButton);
  });

  test("StandardReportPage navigates to next route onError", async () => {
    mockedUseStore.mockReturnValue(mockReportStoreWithoutData);
    const result = render(standardPageSectionComponent);
    const textFieldInput: HTMLInputElement = result.container.querySelector(
      "[id='mock-text-field'"
    )!;
    await userEvent.type(textFieldInput, "      ");
    const continueButton = screen.getByText("Continue")!;
    await userEvent.click(continueButton);
    // test that form navigates with an error in the field
    const newPath = window.location.pathname;
    expect(newPath).not.toEqual("/");
  });
});

describe("Test StandardReportPage accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    mockedUseStore.mockReturnValue(mockReportStore);
    const { container } = render(standardPageSectionComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
