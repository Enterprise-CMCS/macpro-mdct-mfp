import { render, screen } from "@testing-library/react";
import { useStore } from "utils";
import {
  mockReportStore,
  mockEntityStore,
  mockWpReportContext,
} from "utils/testing/setupJest";
import { ReportContext } from "components/reports/ReportProvider";
import { entityTypes } from "types";
import { ExportedEntityDetailsTable } from "./ExportedEntityDetailsTable";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockEntityStore);

mockedUseStore.mockReturnValue(mockReportStore);

const entity = {
  type: entityTypes[0],
  name: "mock-name",
  id: "mock-initative-id",
  isOtherEntity: true,
  initiative_wp_otherTopic: "",
  initiative_wpTopic: [
    {
      key: "initiative_wpTopic",
      value: "Quality measurement and improvement",
    },
  ],
  initiative_name: "fdsfs",
  initiative: [
    {
      id: "mock-initative-id",
      name: "mock-name",
      "mock-initative-id": [
        {
          id: "mock-objective-1",
          objectiveProgress_objectiveName: "mock-objective-name-1",
          objectiveProgress_description: "2",
          objectiveProgress_targets: "3",
          objectiveTargets_projections_2024Q1: "1",
        },
        {
          id: "mock-objective-2",
          objectiveProgress_objectiveName: "mock-objective-name-2",
          objectiveProgress_description: "0",
          objectiveProgress_targets: "9",
          objectiveTargets_projections_2024Q1: "8",
        },
      ],
      mockObjectiveProgress: [
        {
          id: "mock-objective-1",
          objectiveProgress_objectiveName: "mock-objective-name-1",
          objectiveProgress_description: "2",
          objectiveProgress_targets: "3",
          objectiveTargets_projections_2024Q1: "1",
        },
        {
          id: "mock-objective-2",
          objectiveProgress_objectiveName: "mock-objective-name-2",
          objectiveProgress_description: "0",
          objectiveProgress_targets: "9",
          objectiveTargets_projections_2024Q1: "8",
        },
      ],
    },
  ],
};

const fields = [
  {
    id: "mock-initative-id",
    type: "mock type",
    validation: "",
    props: {
      choices: [
        {
          id: "mock-initative-id_",
          label: "Yes",
        },
      ],
    },
  },
];

const exportedEntityDetailsTableComponent = () => (
  <ReportContext.Provider value={mockWpReportContext}>
    <ExportedEntityDetailsTable
      fields={fields}
      entity={entity}
    ></ExportedEntityDetailsTable>
  </ReportContext.Provider>
);

describe("ExportedEntityDetailsTable", () => {
  it("renders successfully", () => {
    render(exportedEntityDetailsTableComponent());

    expect(
      screen.getByTestId("exportedEntityDetailsTable")
    ).toBeInTheDocument();
  });
});
