import { render, screen } from "@testing-library/react";
import { useStore } from "utils";
import { ReportContext } from "components/reports/ReportProvider";
import { entityTypes } from "types";
import {
  mockWpReportContext,
  mockReportStore,
  mockEntityStore,
} from "utils/testing/setupJest";
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
      key: "initiative_wpTopic-",
      value: "Quality measurement and improvement",
    },
  ],
  initiative_name: "fdsfs",
  "mock-initative-id": {
    test: {
      key: "mock-initative-id_Test",
      value: "Yes",
    },
  },
};

const fields = [
  {
    id: "mock-initative-id",
    props: {
      hint: "fdsf",
      label: "lfdsfds",
      choices: [
        {
          id: "mock-initative-id",
          label: "Yes",
        },
      ],
    },
    type: "mock type",
    validation: "",
  },
  {
    id: "something-else",
    props: {
      hint: "fdsf",
      label: "lfdsfds",
    },
    type: "mock type",
    validation: "",
  },
];

const exportedEntityDetailsTableComponent = () => (
  <ReportContext.Provider value={mockWpReportContext}>
    <ExportedEntityDetailsTable
      fields={fields}
      entity={entity}
      data-testid="exportedEntityDetailsTable"
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
