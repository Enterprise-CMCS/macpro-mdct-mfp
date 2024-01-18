import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
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

describe("Test AdminDashSelector view", () => {
  test("Check that AdminDashSelector view renders", () => {
    render(adminDashSelectorView());
    expect(screen.getByText(verbiage.readOnly.header)).toBeVisible();
  });

  test("Check that submit button is disabled if no report type is selected", () => {
    render(adminDashSelectorView());
    expect(screen.getByRole("button").hasAttribute("disabled")).toBeTruthy;
  });

  test("Form submits correctly", async () => {
    const result = render(adminDashSelectorView());
    const form = result.container;
    const dropdownInput = form.querySelector("[name='state']")!;
    await fireEvent.change(dropdownInput, { target: { value: "CA" } });
    const reportInput = form.querySelector("[name='report']")!;
    fireEvent.click(reportInput, { target: { value: "WP" } });
    const submitButton = screen.getByRole("button");
    await userEvent.click(submitButton);
    expect(window.location.pathname).toEqual("/wp");
  });
});

describe("Test AdminDashSelector view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(adminDashSelectorView());
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
