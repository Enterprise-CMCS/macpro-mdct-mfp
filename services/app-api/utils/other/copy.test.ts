import { copyFieldDataFromSource } from "./copy";
import { getReportFieldData } from "../../storage/reports";
import { ReportJson, ReportRoute, FormField } from "../types";

jest.mock("../../storage/reports", () => ({
  getReportFieldData: jest.fn(),
}));

describe("Field data copy", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Should copy validated fields", async () => {
    (getReportFieldData as jest.Mock).mockResolvedValueOnce({
      mockFieldId: "42",
    });
    const fieldData = {};
    const formTemplate = {
      routes: [
        {
          form: {
            fields: [
              {
                id: "mockFieldId",
                validation: "number",
              },
            ],
          },
        },
      ],
    } as ReportJson;

    const copiedData = await copyFieldDataFromSource(
      "CO",
      "mock-source-id",
      formTemplate,
      fieldData
    );

    expect(copiedData).toEqual({
      mockFieldId: "42",
    });
  });

  test("Should overwrite populated fields, apparently", async () => {
    (getReportFieldData as jest.Mock).mockResolvedValueOnce({
      mockFieldId: "42",
    });
    const fieldData = {
      mockFieldId: "255",
    };
    const formTemplate = {
      routes: [
        {
          form: {
            fields: [
              {
                id: "mockFieldId",
                validation: "number",
              },
            ],
          },
        },
      ],
    } as ReportJson;

    const copiedData = await copyFieldDataFromSource(
      "CO",
      "mock-source-id",
      formTemplate,
      fieldData
    );

    expect(copiedData).toEqual({
      mockFieldId: "42",
    });
  });

  test("Should not copy fields with no validation", async () => {
    (getReportFieldData as jest.Mock).mockResolvedValueOnce({
      mockFieldId: "42",
    });
    const fieldData = {};
    const formTemplate = {
      routes: [] as ReportRoute[],
    } as ReportJson;

    const copiedData = await copyFieldDataFromSource(
      "CO",
      "mock-source-id",
      formTemplate,
      fieldData
    );

    expect(copiedData).toEqual({});
  });

  test("Should not copy entities with no validated fields", async () => {
    (getReportFieldData as jest.Mock).mockResolvedValueOnce({
      mockEntityType: [
        {
          mockFieldId: "42",
        },
      ],
    });
    const fieldData = {};
    const formTemplate = {
      routes: [] as ReportRoute[],
    } as ReportJson;

    const copiedData = await copyFieldDataFromSource(
      "CO",
      "mock-source-id",
      formTemplate,
      fieldData
    );

    expect(copiedData).toEqual({});
  });

  test("Should copy validated fields within entities", async () => {
    (getReportFieldData as jest.Mock).mockResolvedValueOnce({
      mockEntityType: [
        {
          mockFieldId: "42",
        },
      ],
    });
    const fieldData = {};
    const formTemplate = {
      routes: [
        {
          pageType: "modalDrawer",
          entityType: "mockEntityType",
          drawerForm: {
            fields: [
              {
                id: "mockFieldId",
                validation: "number",
              },
            ],
          },
        },
      ],
    } as ReportJson;

    const copiedData = await copyFieldDataFromSource(
      "CO",
      "mock-source-id",
      formTemplate,
      fieldData
    );

    expect(copiedData).toEqual({
      mockEntityType: [
        expect.objectContaining({
          mockFieldId: "42",
        }),
      ],
    });
  });

  test("Should copy special fields within entities", async () => {
    (getReportFieldData as jest.Mock).mockResolvedValueOnce({
      mockEntityType: [
        {
          mock_name_field: "mock name", // key includes the string "name"
          key: "mock key",
          value: "mock value",
          id: "mock id",
          type: "mock type",
          isOtherEntity: "mock is other",
          isRequired: "mock is required",
          isInitiativeClosed: false,
        },
      ],
    });
    const fieldData = {};
    const formTemplate = {
      routes: [
        {
          pageType: "modalDrawer",
          entityType: "mockEntityType",
          drawerForm: {
            fields: [
              /* no validated fields, so anything copied is special */
            ] as FormField[],
          },
        },
      ],
    } as ReportJson;

    const copiedData = await copyFieldDataFromSource(
      "CO",
      "mock-source-id",
      formTemplate,
      fieldData
    );

    expect(copiedData).toEqual({
      mockEntityType: [
        {
          mock_name_field: "mock name",
          key: "mock key",
          value: "mock value",
          id: "mock id",
          type: "mock type",
          isOtherEntity: "mock is other",
          isRequired: "mock is required",
          isInitiativeClosed: false,
          isCopied: true,
        },
      ],
    });
  });

  test("Should not copy closed initiatives", async () => {
    (getReportFieldData as jest.Mock).mockResolvedValueOnce({
      mockEntityType: [
        {
          mockFieldId: "42",
          isInitiativeClosed: true,
        },
      ],
    });
    const fieldData = {};
    const formTemplate = {
      routes: [
        {
          pageType: "modalDrawer",
          entityType: "mockEntityType",
          drawerForm: {
            fields: [
              {
                id: "mockFieldId",
                validation: "number",
              },
            ],
          },
        },
      ],
    } as ReportJson;

    const copiedData = await copyFieldDataFromSource(
      "CO",
      "mock-source-id",
      formTemplate,
      fieldData
    );

    // I think this is a bug actually. Probably it should not copy this entity.
    expect(copiedData).toEqual({ mockEntityType: [] });
  });

  test("Should wipe the entire entity if no fields are being copied", async () => {
    (getReportFieldData as jest.Mock).mockResolvedValueOnce({
      mockEntityType: [
        {
          mockFieldId: "42",
        },
      ],
    });
    const fieldData = {};
    const formTemplate = {
      routes: [
        {
          pageType: "modalDrawer",
          entityType: "mockEntityType",
          drawerForm: {
            fields: [
              /* no validated fields, therefore no copied fields */
            ] as FormField[],
          },
        },
      ],
    } as ReportJson;

    const copiedData = await copyFieldDataFromSource(
      "CO",
      "mock-source-id",
      formTemplate,
      fieldData
    );

    expect(copiedData).toEqual({});
  });

  test("Should prune entity steps", async () => {
    (getReportFieldData as jest.Mock).mockResolvedValueOnce({
      mockEntityType: [
        {
          mockSteps: [
            {
              mockFieldId: "42",
              mockExtraField: "not validated and thus not copied",
            },
          ],
        },
      ],
    });
    const fieldData = {};
    const formTemplate = {
      routes: [
        {
          pageType: "modalDrawer",
          entityType: "mockEntityType",
          drawerForm: {
            fields: [
              {
                id: "mockFieldId",
                validation: "number",
              },
            ],
          },
        },
      ],
    } as ReportJson;

    const copiedData = await copyFieldDataFromSource(
      "CO",
      "mock-source-id",
      formTemplate,
      fieldData
    );

    expect(copiedData).toEqual({
      mockEntityType: [
        {
          mockSteps: [
            {
              mockFieldId: "42",
              isCopied: true,
            },
          ],
          isCopied: true,
        },
      ],
    });
  });
});
