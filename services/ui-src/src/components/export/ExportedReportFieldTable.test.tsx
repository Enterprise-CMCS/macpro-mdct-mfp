import { render, screen } from "@testing-library/react";
import {
  mockDrawerReportPageJson,
  mockFormField,
  mockNestedFormField,
  mockStandardReportPageJson,
  mockUseSARStore,
  mockUseStore,
} from "utils/testing/setupJest";
import { useStore } from "../../utils";
import { ExportedReportFieldTable } from "./ExportedReportFieldTable";
import { DrawerReportPageShape } from "types";
import { testA11y } from "utils/testing/commonTests";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

// Contexts
const reportJsonFields = [{ ...mockNestedFormField, id: "parent" }];

// Report JSON
const mockStandardPageJson = {
  ...mockStandardReportPageJson,
  form: {
    id: "standard",
    fields: reportJsonFields,
  },
};
const mockDrawerPageJson = {
  ...mockDrawerReportPageJson,
  drawerForm: { id: "drawer", fields: reportJsonFields },
};
const mockEmptyPageJson = {
  ...mockStandardReportPageJson,
  form: {
    id: "standard",
    fields: [],
  },
};

const hintJson = {
  ...mockStandardReportPageJson,
  form: {
    id: "not-apoc",
    fields: [
      {
        ...mockFormField,
        props: {
          label: "X. Mock Field label",
          hint: "Mock Hint Text",
        },
      },
    ],
  },
};

const generalInformationJson = {
  name: "General Information",
  path: "/sar/general-information",
  pageType: "standard",
  verbiage: {
    intro: {
      section: "",
      subsection: "General Information",
      hint: "",
    },
  },
  form: {
    id: "ga",
    fields: [
      {
        ...mockFormField,
        props: {
          label: "X. Mock Field label",
          hint: "Mock Hint Text",
        },
      },
    ],
  },
};

const exportedStandardTableComponent = (
  <ExportedReportFieldTable section={mockStandardPageJson} />
);
const exportedDrawerTableComponent = (
  <ExportedReportFieldTable
    section={mockDrawerPageJson as DrawerReportPageShape}
  />
);
const emptyTableComponent = (
  <ExportedReportFieldTable section={mockEmptyPageJson} />
);

const hintComponent = <ExportedReportFieldTable section={hintJson} />;

const generalInformationComponent = (
  <ExportedReportFieldTable section={generalInformationJson} />
);

describe("<ExportedReportFieldTable />", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Is present", () => {
    mockedUseStore.mockReturnValue(mockUseStore);
    render(exportedStandardTableComponent);
    const row = screen.getByTestId("exportTable");
    expect(row).toBeVisible();
  });

  test("handles drawer pages with children", () => {
    mockedUseStore.mockReturnValue(mockUseStore);
    render(exportedDrawerTableComponent);
    const row = screen.getByTestId("exportTable");
    expect(row).toBeVisible();
  });

  test("handles a table with no form fields", () => {
    mockedUseStore.mockReturnValue(mockUseStore);
    render(emptyTableComponent);
    const row = screen.getByTestId("exportTable");
    expect(row).toBeVisible();
  });

  test("shows the hint text in most cases", () => {
    mockedUseStore.mockReturnValue(mockUseSARStore);
    render(hintComponent);
    const hint = screen.queryByText(/Mock Hint Text/);
    expect(hint).toBeVisible();
  });

  test("shows that general information renders correctly", () => {
    mockedUseStore.mockReturnValue(mockUseSARStore);
    render(generalInformationComponent);
    expect(
      screen.queryByText("Resubmission Information")
    ).not.toBeInTheDocument();
  });

  testA11y(exportedStandardTableComponent, () => {
    mockedUseStore.mockReturnValue(mockUseStore);
  });
});
