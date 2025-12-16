// Mock flags before imports to avoid ReferenceError
const mockFlag = { basePath: "/mock" };
jest.mock("../../forms/routes/wp/flags", () => ({
  mockFlag,
}));

import { createHash } from "crypto";
import {
  compileValidationJsonFromRoutes,
  flattenReportRoutesArray,
  formTemplateForReportType,
  getOrCreateFormTemplate,
  isFieldElement,
  isLayoutElement,
} from "./formTemplates";
// forms
import { wpReportJson as wp, sarReportJson as sar } from "../../forms";
// flagged routes
import * as wpFlags from "../../forms/routes/wp/flags";
// mocks
import { mockReportJson, mockWPMetadata } from "../testing/setupJest";
// types
import {
  AnyObject,
  DynamicModalOverlayReportPageShape,
  EntityDetailsOverlayShape,
  FormField,
  FormJson,
  FormLayoutElement,
  ModalOverlayReportPageVerbiage,
  OverlayModalPageShape,
  ReportJson,
  ReportRoute,
  ReportType,
} from "../types";
// utils
import { transformFormTemplate } from "../transformations/transformations";
import {
  getReportFormTemplate,
  putFormTemplateVersion,
  putReportFormTemplate,
  queryFormTemplateVersionByHash,
  queryLatestFormTemplateVersionNumber,
} from "../../storage/reports";
import { isFeatureFlagEnabled } from "../featureFlags/featureFlags";

jest.mock("../../storage/reports", () => ({
  getReportFormTemplate: jest.fn(),
  putFormTemplateVersion: jest.fn(),
  putReportFormTemplate: jest.fn(),
  queryFormTemplateVersionByHash: jest.fn(),
  queryLatestFormTemplateVersionNumber: jest.fn(),
}));

jest.mock("../featureFlags/featureFlags", () => ({
  isFeatureFlagEnabled: jest.fn(),
}));

const mockWorkPlanFieldData = mockWPMetadata.fieldData;
const reportPeriod = 2;
const reportYear = 2023;

const generateReportHash = (
  report: AnyObject,
  reportYear: number,
  reportPeriod: number,
  workPlanFieldData: AnyObject
) => {
  let currentFormTemplate = structuredClone(report) as ReportJson;
  if (currentFormTemplate?.routes) {
    currentFormTemplate = transformFormTemplate(
      currentFormTemplate,
      reportPeriod,
      reportYear,
      workPlanFieldData
    );
  }

  return createHash("md5")
    .update(JSON.stringify(currentFormTemplate))
    .digest("hex");
};

describe("Test getOrCreateFormTemplate WP", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("should create a new form template if none exist", async () => {
    (queryFormTemplateVersionByHash as jest.Mock).mockResolvedValue(undefined);
    (queryLatestFormTemplateVersionNumber as jest.Mock).mockResolvedValue(0);
    const expectedFormInformation = {
      type: "WP",
      name: "MFP Work Plan",
    };

    const currentWPFormHash = generateReportHash(
      wp,
      reportYear,
      reportPeriod,
      mockWorkPlanFieldData
    );
    const result = await getOrCreateFormTemplate(
      ReportType.WP,
      reportPeriod,
      reportYear,
      mockWorkPlanFieldData
    );
    expect(putFormTemplateVersion).toHaveBeenCalled();
    expect(putReportFormTemplate).toHaveBeenCalled();
    expect(result.formTemplate).toEqual(
      expect.objectContaining(expectedFormInformation)
    );
    expect(result.formTemplateVersion.versionNumber).toEqual(1);
    expect(result.formTemplateVersion.md5Hash).toEqual(currentWPFormHash);
  });

  it("should return the right form and formTemplateVersion if it matches the most recent form", async () => {
    (getReportFormTemplate as jest.Mock).mockResolvedValue(wp);
    const currentWPFormHash = generateReportHash(
      wp,
      reportYear,
      reportPeriod,
      mockWorkPlanFieldData
    );
    (queryFormTemplateVersionByHash as jest.Mock).mockResolvedValue({
      id: "ghi.json",
      md5Hash: currentWPFormHash,
      versionNumber: 3,
    });
    const result = await getOrCreateFormTemplate(
      ReportType.WP,
      reportPeriod,
      reportYear,
      mockWorkPlanFieldData
    );
    expect(getReportFormTemplate).toHaveBeenCalled();
    expect(result.formTemplateVersion?.versionNumber).toEqual(3);
    expect(result.formTemplateVersion?.md5Hash).toEqual(currentWPFormHash);
  });

  it("should create a new form if it doesn't match the most recent form", async () => {
    (queryFormTemplateVersionByHash as jest.Mock).mockResolvedValue(undefined);
    (queryLatestFormTemplateVersionNumber as jest.Mock).mockResolvedValue(3);
    const currentWPFormHash = generateReportHash(
      wp,
      reportYear,
      reportPeriod - 1,
      mockWorkPlanFieldData
    );

    const result = await getOrCreateFormTemplate(
      ReportType.WP,
      reportPeriod - 1,
      reportYear,
      mockWorkPlanFieldData
    );
    expect(putFormTemplateVersion).toHaveBeenCalled();
    expect(putReportFormTemplate).toHaveBeenCalled();
    expect(result.formTemplateVersion?.versionNumber).toEqual(4);
    expect(result.formTemplateVersion?.md5Hash).toEqual(currentWPFormHash);
  });
});

describe("Test getOrCreateFormTemplate SAR", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should create a new form template if none exist", async () => {
    (queryFormTemplateVersionByHash as jest.Mock).mockResolvedValue(undefined);
    (queryLatestFormTemplateVersionNumber as jest.Mock).mockResolvedValue(0);
    const expectedFormInformation = {
      type: "SAR",
      name: "MFP Semi-Annual Progress Report (SAR)",
    };

    const currentSARFormHash = generateReportHash(
      sar,
      reportYear,
      reportPeriod,
      mockWorkPlanFieldData
    );
    const result = await getOrCreateFormTemplate(
      ReportType.SAR,
      reportPeriod,
      reportYear,
      mockWorkPlanFieldData
    );
    expect(putFormTemplateVersion).toHaveBeenCalled();
    expect(putReportFormTemplate).toHaveBeenCalled();
    expect(result.formTemplate).toEqual(
      expect.objectContaining(expectedFormInformation)
    );
    expect(result.formTemplateVersion?.versionNumber).toEqual(1);
    expect(result.formTemplateVersion?.md5Hash).toEqual(currentSARFormHash);
  });

  it("should return the right form and formTemplateVersion if it matches the most recent form", async () => {
    const currentSARFormHash = generateReportHash(
      sar,
      reportYear,
      reportPeriod,
      mockWorkPlanFieldData
    );
    (getReportFormTemplate as jest.Mock).mockResolvedValue(sar);
    (queryFormTemplateVersionByHash as jest.Mock).mockResolvedValue({
      formTemplateId: "foo",
      id: "mockReportJson",
      md5Hash: currentSARFormHash,
      versionNumber: 3,
    });
    const result = await getOrCreateFormTemplate(
      ReportType.SAR,
      reportPeriod,
      reportYear,
      mockWorkPlanFieldData
    );
    expect(putFormTemplateVersion).not.toHaveBeenCalled();
    expect(putReportFormTemplate).not.toHaveBeenCalled();
    expect(getReportFormTemplate).toHaveBeenCalled();
    expect(result.formTemplateVersion?.versionNumber).toEqual(3);
    expect(result.formTemplateVersion?.md5Hash).toEqual(currentSARFormHash);
  });

  it("should create a new form if it doesn't match the most recent form", async () => {
    const currentSARFormHash = generateReportHash(
      sar,
      reportYear,
      reportPeriod - 1,
      mockWorkPlanFieldData
    );
    (queryFormTemplateVersionByHash as jest.Mock).mockResolvedValue(undefined);
    (queryLatestFormTemplateVersionNumber as jest.Mock).mockResolvedValue(3);

    const result = await getOrCreateFormTemplate(
      ReportType.SAR,
      reportPeriod - 1,
      reportYear,
      mockWorkPlanFieldData
    );
    expect(putFormTemplateVersion).toHaveBeenCalled();
    expect(putReportFormTemplate).toHaveBeenCalled();
    expect(result.formTemplateVersion?.versionNumber).toEqual(4);
    expect(result.formTemplateVersion?.md5Hash).toEqual(currentSARFormHash);
  });
});

describe("Test form contents", () => {
  const allFormTemplates = async () => {
    const templates = [];
    for (let reportType of Object.values(ReportType)) {
      try {
        const formTemplate = await formTemplateForReportType(reportType);
        templates.push(formTemplate);
      } catch (error: any) {
        if (!/not implemented/i.test(error.message)) {
          throw error;
        }
      }
    }
    return templates;
  };

  const flattenRoutes = (routes: ReportRoute[]) => {
    let flatRoutes: ReportRoute[] = [];
    for (let route of routes) {
      flatRoutes.push(route);
      if (route.children) {
        flatRoutes = flatRoutes.concat(flattenRoutes(route.children));
      }
    }
    return flatRoutes;
  };

  const allFormsIn = (formTemplate: ReportJson) => {
    const forms: FormJson[] = [];
    for (let route of flattenRoutes(formTemplate.routes)) {
      for (let possibleForm of Object.values(route)) {
        // This covers route.form, route.modalForm, etc
        if (possibleForm?.fields) {
          forms.push(possibleForm);
        }
      }
    }
    return forms;
  };

  /*
   * Every field is either a field (like a textbox, or a date), or not a field
   * (like a section header). But our type guards are not particularly robust.
   * When a new field type is added, the type guards may need to be updated.
   * That will happen rarely enough that we will forget to do so;
   * this test is here to remind us.
   */
  it("Should contain fields of known types", async () => {
    const templates = await allFormTemplates();
    for (let formTemplate of templates) {
      for (let form of allFormsIn(formTemplate)) {
        for (let field of form.fields) {
          const isField = isFieldElement(field);
          const isLayout = isLayoutElement(field);
          const baseField = field as FormField | FormLayoutElement;
          if (isField && isLayout) {
            throw new Error(
              `Field '${baseField.id}' of type ${baseField.type} has confused the field type guards! Update them.`
            );
          } else if (!isField && !isLayout) {
            throw new Error(
              `Field '${baseField.id}' of type ${baseField.type} has confused the field type guards! Update them.`
            );
          }
        }
      }
    }
  });

  test("returns flagged routes", async () => {
    (isFeatureFlagEnabled as jest.Mock).mockResolvedValue(true);
    const template = await formTemplateForReportType(ReportType.WP);
    expect(wpFlags).toEqual({ default: { mockFlag }, mockFlag });
    expect(template).toEqual(mockFlag);
  });
});

describe("Test compileValidationJsonFromRoutes", () => {
  it("Compiles validation from forms of any kind", () => {
    const result = compileValidationJsonFromRoutes(
      flattenReportRoutesArray(mockReportJson.routes)
    );
    expect(result).toEqual({
      entityType: "objectArray",
      "mock-date-field": "date",
      "mock-drawer-text-field": "text",
      "mock-dropdown-field": "dropdown",
      "mock-modal-text-field": "text",
      "mock-number-field": "number",
      "mock-text-field": "text",
    });
  });

  it("Compiles validation from dynamicModalOverlay pages", () => {
    const dynamicModalOverlayRoute: DynamicModalOverlayReportPageShape = {
      pageType: "dynamicModalOverlay",
      name: "mock name",
      path: "mock/path",
      entityType: "initiative",
      entityInfo: [] as string[],
      verbiage: {} as ModalOverlayReportPageVerbiage,
      initiatives: [
        {
          initiativeId: "init1",
          name: "mock init 1",
          topic: "mock topic",
          dashboard: {} as FormJson,
          entitySteps: [
            {
              stepName: "mock entity 1 1",
              form: {
                id: "mock-form-id",
                fields: [
                  {
                    id: "text-field-1-1",
                    validation: "text",
                  },
                  {
                    id: "number-field-1-1",
                    validation: "number",
                  },
                ],
              },
            } as EntityDetailsOverlayShape,
            {
              stepName: "mock entity 1 2",
              modalForm: {
                fields: [] as FormField[],
              },
            } as OverlayModalPageShape,
            {
              stepName: "mock entity 1 3",
              objectiveCards: [
                {
                  modalForm: {
                    fields: [] as FormField[],
                  },
                },
              ],
            } as OverlayModalPageShape,
          ],
        },
        {
          initiativeId: "init2",
          name: "mock init 2",
          topic: "mock topic",
          dashboard: {} as FormJson,
          entitySteps: [
            {
              stepName: "mock entity 2 1",
              form: {
                fields: [] as FormField[],
              },
            } as EntityDetailsOverlayShape,
            {
              stepName: "mock entity 2 2",
              modalForm: {
                id: "mock-form-id",
                fields: [
                  {
                    id: "email-field-2-2",
                    validation: "email",
                  },
                  {
                    id: "ratio-field-2-2",
                    validation: "ratio",
                  },
                ],
              },
            } as OverlayModalPageShape,
          ],
        },
      ],
    };

    const result = compileValidationJsonFromRoutes([dynamicModalOverlayRoute]);

    expect(result).toEqual({
      initiative: "objectArray",
      "text-field-1-1": "text",
      "number-field-1-1": "number",
      "email-field-2-2": "email",
      "ratio-field-2-2": "ratio",
    });
  });
});
