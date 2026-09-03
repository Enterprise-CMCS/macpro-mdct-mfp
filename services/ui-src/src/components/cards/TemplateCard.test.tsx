import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedFunction } from "vitest";
// components
import { TemplateCard } from "components";
// utils
import {
  mockStateUserStore,
  mockUseStore,
  RouterWrappedComponent,
} from "utils/testing/setupTest";
import { useStore } from "utils";
// verbiage
import verbiage from "verbiage/pages/home";
import { MfpReportState, MfpUserState } from "../../types";
import { testA11yAct } from "utils/testing/commonTests";

vi.mock("utils/other/useBreakpoint", () => ({
  useBreakpoint: vi.fn(() => ({
    isDesktop: true,
  })),
}));

vi.mock("utils/auth/useUser");
vi.mock("utils/state/useStore");

const mockedUseStore = useStore as MockedFunction<typeof useStore>;

const mockUseNavigate = vi.fn();

vi.mock("react-router", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => mockUseNavigate,
}));

const wpTemplateVerbiage = verbiage.cards.WP;

const mockUseStoreNoReports: MfpReportState & MfpUserState = {
  report: undefined,
  reportsByState: [],
  submittedReportsByState: [],
  lastSavedTime: "12:30 PM",
  workPlanToCopyFrom: undefined,
  autosaveState: false,
  editable: true,
  setReport: () => {},
  setReportsByState: () => {},
  clearReportsByState: () => {},
  setSubmittedReportsByState: () => {},
  setLastSavedTime: () => {},
  setWorkPlanToCopyFrom: () => {},
  setAutosaveState: () => {},
  setEditable: () => {},
  // We need to add the user store, as that is where the "lastAlteredBy" field is fetched from
  ...mockStateUserStore,
};

const wpTemplateCardComponent = (
  <RouterWrappedComponent>
    <TemplateCard templateName="WP" verbiage={wpTemplateVerbiage} />
  </RouterWrappedComponent>
);

describe("<TemplateCard />", () => {
  describe("Renders", () => {
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
      await act(async () => {
        await userEvent.click(templateCardLink);
      });
      const expectedRoute = wpTemplateVerbiage.link.route;
      await expect(mockUseNavigate).toHaveBeenCalledWith(expectedRoute);
    });

    test("'Enter Work Plan' button is disabled for user with no access to this report", async () => {
      mockedUseStore.mockReturnValue(mockUseStoreNoReports);
      const templateCardLink = screen.getByText(wpTemplateVerbiage.link.text)!;
      expect(templateCardLink).toBeDisabled;
    });
  });

  testA11yAct(wpTemplateCardComponent);
});
