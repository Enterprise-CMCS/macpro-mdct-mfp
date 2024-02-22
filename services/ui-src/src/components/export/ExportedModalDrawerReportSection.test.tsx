import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { useStore } from "utils";
import {
  mockReportStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { ModalDrawerReportPageVerbiage } from "types";
import {
  ExportedModalDrawerReportSection,
  Props,
} from "./ExportedModalDrawerReportSection";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const defaultMockProps = {
  section: {
    entityType: "entityType",
    verbiage: {
      accordion: {
        buttonLabel: "Instructions",
        intro: [
          {
            type: "html",
            content:
              "Target populations are used to understand differences in participation and the impact of the MFP Demonstration for people with varying disabilities.<br><br><b>Defining target populations</b><br>An approach for defining target populations should be outlined in your Operational Protocol. Those definitions should be used to report the transition benchmarks.",
          },
          {
            type: "html",
            content:
              "<br><br>You have flexibility when defining your state or territory’s target populations. Approaches to defining the standard MFP target populations focused on older adults, people with physical disabilities (PD), intellectual or developmental disabilities (I/DD), or mental health or substance use disorders (MH/SUD), may vary among recipients, and could draw on:",
          },
        ],
        list: [
          "the individual's primary diagnosis",
          "qualified institutional setting",
          "expected service utilization",
          "HCBS authority enrollment",
          "or other criteria",
        ],
        text: [
          {
            type: "html",
            content:
              "<b>About adding “other” target populations</b><br>If you are using the “Other” category, clearly describe the rationale and criteria for defining this category in your Operational Protocol, as needed.",
          },
          {
            type: "html",
            content:
              "<br><br><b>How to best categorize which population to attribute the transition to avoid duplication</b><br>You may need to track some populations to see utilization to address questions from stakeholders and those circumstances should be discussed with your CMS MFP Project Officer. For example, if a person has a dual-diagnosis such as an individual with intellectual and developmental disabilities (I/DD) and mental health and substance use disorders (MH/SUD), the service dollars may be expended under an HCBS authority that focuses on people with I/DD, rather than MH/SUD. You could review claims to determine that someone is also receiving mental health services. This additional step may necessitate a tracking mechanism outside of the MFP Work Plan and Semi-Annual Progress Report and should be discussed with your Project Officer.",
          },
        ],
      },
      intro: {
        section: "",
        subsection: "Transition Benchmark Projections",
        info: [
          {
            type: "html",
            content:
              "Provide the projected number of transitions for target populations during each quarter. This number includes institutional residents who are discharged from an institution to a qualified residence during the reporting period, enroll in MFP, and begin using Medicaid home and community-based services (HCBS).",
          },
        ],
      },
      dashboardTitle:
        "Report projected number of transitions for each target population",
      pdfDashboardTitle: "Transition Benchmark Totals",
      addEntityButtonText: "Add other target population",
      editEntityButtonText: "Edit name",
      readOnlyEntityButtonText: "View name",
      addEditModalAddTitle: "Add other target population",
      addEditModalEditTitle: "Edit other target population",
      deleteEntityButtonAltText: "Delete other target population",
      deleteModalTitle:
        "Are you sure you want to delete this target population?",
      deleteModalConfirmButtonText: "Yes, delete population",
      deleteModalWarning:
        "Are you sure you want to proceed? You will lose all information entered for this population in the Work Plan. The population will remain in previously submitted MFP Semi-Annual Reports if applicable.",
      entityUnfinishedMessage:
        "Complete the remaining indicators for this access measure by entering details.",
      enterEntityDetailsButtonText: "Edit",
      readOnlyEntityDetailsButtonText: "View",
      reviewPdfHint:
        "To view Transition Benchmark Totals by target population and by quarter, click <i>Review PDF</i> and it will open a summary in a new tab.",
      drawerTitle: "Report transition benchmarks for ",
      drawerInfo: [
        {
          type: "span",
          content:
            "Please provide the projected number of transitions for the target population during each quarter. This number includes institutional residents who are discharged from an institution to a qualified residence during the reporting period, enroll in MFP, and begin using Medicaid HCBS.",
        },
        {
          type: "p",
          content:
            "Complete all fields and select the <i>Save & close</i> button to save this section.",
        },
      ],
    } as ModalDrawerReportPageVerbiage,
  },
} as Props;

const testComponent = (
  <RouterWrappedComponent>
    <ExportedModalDrawerReportSection {...defaultMockProps} />
  </RouterWrappedComponent>
);

const tableComponent = (
  <RouterWrappedComponent>
    <ExportedModalDrawerReportSection {...defaultMockProps} />
  </RouterWrappedComponent>
);

describe("ExportedModalDrawerReportSection table", () => {
  test("renders correct twelve quarters in table", async () => {
    const mock2024Q1Report = {...mockReportStore, report: {
      ...mockReportStore.report,
      reportPeriod: 1,
      reportYear: 2024,
    }}
    mockedUseStore.mockReturnValue(mock2024Q1Report);
    render(tableComponent);
    
    // should display 12 quarters starting from 2024 Q1
    expect(screen.getByText("2024 Q1")).toBeVisible();
    expect(screen.getByText("2024 Q2")).toBeVisible();
    expect(screen.getByText("2024 Q3")).toBeVisible();
    expect(screen.getByText("2024 Q4")).toBeVisible();
    expect(screen.getByText("2025 Q1")).toBeVisible();
    expect(screen.getByText("2025 Q2")).toBeVisible();
    expect(screen.getByText("2025 Q3")).toBeVisible();
    expect(screen.getByText("2025 Q4")).toBeVisible();
    expect(screen.getByText("2026 Q1")).toBeVisible();
    expect(screen.getByText("2026 Q2")).toBeVisible();
    expect(screen.getByText("2026 Q3")).toBeVisible();
    expect(screen.getByText("2026 Q4")).toBeVisible();

    // should not display quarters before or after those 12
    expect(screen.queryByText("2023 Q3")).not.toBeInTheDocument();
    expect(screen.queryByText("2023 Q4")).not.toBeInTheDocument();
    expect(screen.queryByText("2027 Q1")).not.toBeInTheDocument();
    expect(screen.queryByText("2027 Q2")).not.toBeInTheDocument();

    // renders "Not answered" for each quarter given no entity data
    expect(screen.queryAllByText("Not answered").length).toBe(12);
  });
});

describe("ExportedModalDrawerReportSection", () => {
  test("should not have basic accessibility issues", async () => {
    mockedUseStore.mockReturnValue(mockReportStore);
    const { container } = render(testComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
