import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { AdminDashSelector, ReportContext } from "components";
// utils
import {
  mockAdminUserStore,
  mockWpReportContext,
  RouterWrappedComponent,
} from "utils/testing/setupJest";

// verbiage
import verbiage from "verbiage/pages/home";
// types
import { ReportContextShape } from "types";
import { useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";

// MOCKS

jest.mock("utils/state/useStore");

const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockAdminUserStore);

const adminDashSelectorView = (
  context: ReportContextShape = mockWpReportContext
) => (
  <ReportContext.Provider value={context}>
    <RouterWrappedComponent>
      <AdminDashSelector verbiage={verbiage.readOnly} />
    </RouterWrappedComponent>
  </ReportContext.Provider>
);
// TESTS

describe("<AdminDashSelector />", () => {
  test("Check that AdminDashSelector view renders", () => {
    render(adminDashSelectorView());
    expect(screen.getByText(verbiage.readOnly.header)).toBeVisible();
  });

  test("Check that submit button is disabled if no report type is selected", () => {
    render(adminDashSelectorView());
    expect(
      screen
        .getByRole("button", {
          name: "Go to Report Dashboard",
        })
        .hasAttribute("disabled")
    ).toBeTruthy();
  });

  test("Form submits correctly", async () => {
    const result = render(adminDashSelectorView());
    const form = result.container;
    const dropdownInput = form.querySelector("[name='state']")!;
    await fireEvent.change(dropdownInput, { target: { value: "CA" } });
    const reportInput = form.querySelector("[name='report']")!;
    fireEvent.click(reportInput, { target: { value: "WP" } });
    const submitButton = screen.getByRole("button", {
      name: "Go to Report Dashboard",
    });
    await act(async () => {
      await userEvent.click(submitButton);
    });
    expect(window.location.pathname).toEqual("/wp");
  });

  testA11yAct(adminDashSelectorView());
});
