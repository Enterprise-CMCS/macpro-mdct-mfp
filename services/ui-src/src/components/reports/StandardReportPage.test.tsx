import { render, screen } from "@testing-library/react";
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
import { testA11y } from "utils/testing/commonTests";

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

describe("<StandardReportPage />", () => {
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
    const dateFieldInput: HTMLInputElement = result.container.querySelector(
      "[name='mock-date-field'"
    )!;
    await userEvent.type(dateFieldInput, "01012024");
    expect(dateFieldInput.value).toEqual("01012024");
    const numberFieldInput: HTMLInputElement = result.container.querySelector(
      "[id='mock-number-field'"
    )!;
    await userEvent.type(numberFieldInput, "1");
    expect(numberFieldInput.value).toEqual("1");
    const continueButton = screen.getByText("Continue")!;
    await userEvent.click(continueButton);
    const newPath = window.location.pathname;
    expect(newPath).toEqual("/mock");
  });

  test("StandardReportPage navigates to next route onError", async () => {
    mockedUseStore.mockReturnValue(mockReportStoreWithoutData);
    render(standardPageSectionComponent);
    const continueButton = screen.getByText("Continue")!;
    await userEvent.click(continueButton);
    // test that form navigates with an error in the field
    const newPath = window.location.pathname;
    expect(newPath).not.toEqual("/");
  });

  testA11y(standardPageSectionComponent, () => {
    mockedUseStore.mockReturnValue(mockReportStore);
  });
});
