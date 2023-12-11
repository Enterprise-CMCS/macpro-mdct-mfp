import s3Lib from "../s3/s3-lib";
import { copyFieldDataFromSource } from "./copy";

jest.mock("../s3/s3-lib", () => ({
  ...jest.requireActual("../s3/s3-lib"),
  get: jest.fn(),
}));

describe("Field data copy", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Should copy validated fields", async () => {
    (s3Lib.get as jest.Mock).mockResolvedValueOnce({
      mockFieldId: 42,
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
    };

    const copiedData = await copyFieldDataFromSource(
      "mock-bucket-name",
      "CO",
      "mock-source-id",
      formTemplate,
      fieldData
    );

    expect(copiedData).toEqual({
      mockFieldId: 42,
    });
  });

  test("Should overwrite populated fields, apparently", async () => {
    (s3Lib.get as jest.Mock).mockResolvedValueOnce({
      mockFieldId: 42,
    });
    const fieldData = {
      mockFieldId: 255,
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
    };

    const copiedData = await copyFieldDataFromSource(
      "mock-bucket-name",
      "CO",
      "mock-source-id",
      formTemplate,
      fieldData
    );

    expect(copiedData).toEqual({
      mockFieldId: 42,
    });
  });

  test("Should not copy fields with no validation", async () => {
    (s3Lib.get as jest.Mock).mockResolvedValueOnce({
      mockFieldId: 42,
    });
    const fieldData = {};
    const formTemplate = {
      routes: [],
    };

    const copiedData = await copyFieldDataFromSource(
      "mock-bucket-name",
      "CO",
      "mock-source-id",
      formTemplate,
      fieldData
    );

    expect(copiedData).toEqual({});
  });

  test("Should not copy entities with no validated fields", async () => {
    (s3Lib.get as jest.Mock).mockResolvedValueOnce({
      mockEntityType: [
        {
          mockFieldId: 42,
        },
      ],
    });
    const fieldData = {};
    const formTemplate = {
      routes: [],
    };

    const copiedData = await copyFieldDataFromSource(
      "mock-bucket-name",
      "CO",
      "mock-source-id",
      formTemplate,
      fieldData
    );

    expect(copiedData).toEqual({});
  });

  test("Should copy validated fields within entities", async () => {
    (s3Lib.get as jest.Mock).mockResolvedValueOnce({
      mockEntityType: [
        {
          mockFieldId: 42,
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
    };

    const copiedData = await copyFieldDataFromSource(
      "mock-bucket-name",
      "CO",
      "mock-source-id",
      formTemplate,
      fieldData
    );

    expect(copiedData).toEqual({
      mockEntityType: [
        expect.objectContaining({
          mockFieldId: 42,
        }),
      ],
    });
  });

  test("Should copy special fields within entities", async () => {
    (s3Lib.get as jest.Mock).mockResolvedValueOnce({
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
            ],
          },
        },
      ],
    };

    const copiedData = await copyFieldDataFromSource(
      "mock-bucket-name",
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
    (s3Lib.get as jest.Mock).mockResolvedValueOnce({
      mockEntityType: [
        {
          mockFieldId: 42,
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
    };

    const copiedData = await copyFieldDataFromSource(
      "mock-bucket-name",
      "CO",
      "mock-source-id",
      formTemplate,
      fieldData
    );

    // I think this is a bug actually. Probably it should not copy this entity.
    expect(copiedData).toEqual({ mockEntityType: [] });
  });

  test("Should wipe the entire entity if no fields are being copied", async () => {
    (s3Lib.get as jest.Mock).mockResolvedValueOnce({
      mockEntityType: [
        {
          mockFieldId: 42,
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
            ],
          },
        },
      ],
    };

    const copiedData = await copyFieldDataFromSource(
      "mock-bucket-name",
      "CO",
      "mock-source-id",
      formTemplate,
      fieldData
    );

    expect(copiedData).toEqual({});
  });

  test("Should prune entity steps", async () => {
    (s3Lib.get as jest.Mock).mockResolvedValueOnce({
      mockEntityType: [
        {
          mockSteps: [
            {
              mockFieldId: 42,
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
    };

    const copiedData = await copyFieldDataFromSource(
      "mock-bucket-name",
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
              mockFieldId: 42,
              isCopied: true,
            },
          ],
          isCopied: true,
        },
      ],
    });
  });
});
