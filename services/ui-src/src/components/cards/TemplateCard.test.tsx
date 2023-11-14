import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { TemplateCard } from "components";
// utils
import {
  mockStateUserStore,
  mockUseStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useStore } from "utils";
// verbiage
import verbiage from "verbiage/pages/home";
import { MfpReportState, MfpUserState } from "../../types";

jest.mock("utils/other/useBreakpoint", () => ({
  useBreakpoint: jest.fn(() => ({
    isDesktop: true,
  })),
}));

jest.mock("utils/auth/useUser");
jest.mock("utils/state/useStore");

const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
}));

const wpTemplateVerbiage = verbiage.cards.WP;

const mockUseStoreNoReports: MfpReportState & MfpUserState = {
  report: undefined,
  reportsByState: [],
  submittedReportsByState: [],
  lastSavedTime: "12:30 PM",
  workPlanToCopyFrom: undefined,
  setReport: () => {},
  setReportsByState: () => {},
  clearReportsByState: () => {},
  setSubmittedReportsByState: () => {},
  setLastSavedTime: () => {},
  setWorkPlanToCopyFrom: () => {},
  // We need to add the user store, as that is where the "lastAlteredBy" field is fetched from
  ...mockStateUserStore,
};

const wpTemplateCardComponent = (
  <RouterWrappedComponent>
    <TemplateCard templateName="WP" verbiage={wpTemplateVerbiage} />
  </RouterWrappedComponent>
);

describe("Test WP TemplateCard", () => {
  beforeEach(() => {
    render(wpTemplateCardComponent);
  });

  test("WP TemplateCard is visible", () => {
    expect(screen.getByText(wpTemplateVerbiage.title)).toBeVisible();
  });

  test("WP TemplateCard image is visible on desktop", () => {
    const imageAltText = "Spreadsheet icon";
    expect(screen.getByAltText(imageAltText)).toBeVisible();
  });

  test("WP TemplateCard link is visible on desktop", () => {
    const templateCardLink = wpTemplateVerbiage.link.text;
    expect(screen.getByText(templateCardLink)).toBeVisible();
  });

  test("WP TemplateCard navigates to next route on link click", async () => {
    mockedUseStore.mockReturnValue(mockUseStore);
    const templateCardLink = screen.getByText(wpTemplateVerbiage.link.text)!;
    await userEvent.click(templateCardLink);
    const expectedRoute = wpTemplateVerbiage.link.route;
    await expect(mockUseNavigate).toHaveBeenCalledWith(expectedRoute);
  });

  test("'Enter Work Plan' button is disabled for user with no access to this report", async () => {
    mockedUseStore.mockReturnValue(mockUseStoreNoReports);
    const templateCardLink = screen.getByText(wpTemplateVerbiage.link.text)!;
    expect(templateCardLink).toBeDisabled;
  });
});

describe("Test TemplateCard accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(wpTemplateCardComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
