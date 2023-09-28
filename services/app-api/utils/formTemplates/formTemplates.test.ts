import {
  compileValidationJsonFromRoutes,
  flattenReportRoutesArray,
  formTemplateForReportType,
  getOrCreateFormTemplate,
  getValidationFromFormTemplate,
  isFieldElement,
  isLayoutElement,
} from "./formTemplates";
import wp from "../../forms/wp.json";
import sar from "../../forms/sar.json";
import { createHash } from "crypto";
import { FormJson, ReportJson, ReportRoute, ReportType } from "../types";
import { mockDocumentClient, mockReportJson } from "../testing/setupJest";
import s3Lib from "../s3/s3-lib";
import dynamodbLib from "../dynamo/dynamodb-lib";

describe("Test getOrCreateFormTemplate WP", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  it("should create a new form template if none exist", async () => {
    const currentWPFormHash = createHash("md5")
      .update(JSON.stringify(wp))
      .digest("hex");
    mockDocumentClient.query.promise.mockReturnValueOnce({
      Items: [],
    });
    const dynamoPutSpy = jest.spyOn(dynamodbLib, "put");
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    const result = await getOrCreateFormTemplate(
      "local-wp-reports",
      ReportType.WP
    );
    expect(dynamoPutSpy).toHaveBeenCalled();
    expect(s3PutSpy).toHaveBeenCalled();
    expect(result.formTemplate).toEqual({
      ...wp,
      validationJson: getValidationFromFormTemplate(wp as ReportJson),
    });
    expect(result.formTemplateVersion?.versionNumber).toEqual(1);
    expect(result.formTemplateVersion?.md5Hash).toEqual(currentWPFormHash);
  });

  it("should return the right form and formTemplateVersion if it matches the most recent form", async () => {
    const currentWPFormHash = createHash("md5")
      .update(JSON.stringify(wp))
      .digest("hex");
    mockDocumentClient.query.promise.mockReturnValueOnce({
      Items: [
        {
          formTemplateId: "foo",
          id: "mockReportJson",
          md5Hash: currentWPFormHash,
          versionNumber: 3,
        },
        {
          formTemplateId: "foo",
          id: "mockReportJson",
          md5Hash: currentWPFormHash + "111",
          versionNumber: 2,
        },
      ],
    });
    const dynamoPutSpy = jest.spyOn(dynamodbLib, "put");
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    const result = await getOrCreateFormTemplate(
      "local-wp-reports",
      ReportType.WP
    );
    expect(dynamoPutSpy).not.toHaveBeenCalled();
    expect(s3PutSpy).not.toHaveBeenCalled();
    expect(result.formTemplateVersion?.versionNumber).toEqual(3);
    expect(result.formTemplateVersion?.md5Hash).toEqual(currentWPFormHash);
  });

  it("should create a new form if it doesn't match the most recent form", async () => {
    const currentWPFormHash = createHash("md5")
      .update(JSON.stringify(wp))
      .digest("hex");
    mockDocumentClient.query.promise.mockReturnValueOnce({
      Items: [
        {
          formTemplateId: "foo",
          id: "mockReportJson",
          md5Hash: currentWPFormHash + "111111",
          versionNumber: 3,
        },
        {
          formTemplateId: "foo",
          id: "mockReportJson",
          md5Hash: currentWPFormHash + "111",
          versionNumber: 2,
        },
      ],
    });
    const dynamoPutSpy = jest.spyOn(dynamodbLib, "put");
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    const result = await getOrCreateFormTemplate(
      "local-wp-reports",
      ReportType.WP
    );
    expect(dynamoPutSpy).toHaveBeenCalled();
    expect(s3PutSpy).toHaveBeenCalled();
    expect(result.formTemplateVersion?.versionNumber).toEqual(4);
    expect(result.formTemplateVersion?.md5Hash).toEqual(currentWPFormHash);
  });
});
describe("Test getOrCreateFormTemplate SAR", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  it("should create a new form template if none exist", async () => {
    const currentSARFormHash = createHash("md5")
      .update(JSON.stringify(sar))
      .digest("hex");
    mockDocumentClient.query.promise.mockReturnValueOnce({
      Items: [],
    });
    const dynamoPutSpy = jest.spyOn(dynamodbLib, "put");
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    const result = await getOrCreateFormTemplate(
      "local-sar-reports",
      ReportType.SAR
    );
    expect(dynamoPutSpy).toHaveBeenCalled();
    expect(s3PutSpy).toHaveBeenCalled();
    expect(result.formTemplate).toEqual({
      ...sar,
      validationJson: getValidationFromFormTemplate(sar as ReportJson),
    });
    expect(result.formTemplateVersion?.versionNumber).toEqual(1);
    expect(result.formTemplateVersion?.md5Hash).toEqual(currentSARFormHash);
  });

  it("should return the right form and formTemplateVersion if it matches the most recent form", async () => {
    const currentSARFormHash = createHash("md5")
      .update(JSON.stringify(sar))
      .digest("hex");
    mockDocumentClient.query.promise.mockReturnValueOnce({
      Items: [
        {
          formTemplateId: "foo",
          id: "mockReportJson",
          md5Hash: currentSARFormHash,
          versionNumber: 3,
        },
        {
          formTemplateId: "foo",
          id: "mockReportJson",
          md5Hash: currentSARFormHash + "111",
          versionNumber: 2,
        },
      ],
    });
    const dynamoPutSpy = jest.spyOn(dynamodbLib, "put");
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    const result = await getOrCreateFormTemplate(
      "local-sar-reports",
      ReportType.SAR
    );
    expect(dynamoPutSpy).not.toHaveBeenCalled();
    expect(s3PutSpy).not.toHaveBeenCalled();
    expect(result.formTemplateVersion?.versionNumber).toEqual(3);
    expect(result.formTemplateVersion?.md5Hash).toEqual(currentSARFormHash);
  });

  it("should create a new form if it doesn't match the most recent form", async () => {
    const currentSARFormHash = createHash("md5")
      .update(JSON.stringify(sar))
      .digest("hex");
    mockDocumentClient.query.promise.mockReturnValueOnce({
      Items: [
        {
          formTemplateId: "foo",
          id: "mockReportJson",
          md5Hash: currentSARFormHash + "111111",
          versionNumber: 3,
        },
        {
          formTemplateId: "foo",
          id: "mockReportJson",
          md5Hash: currentSARFormHash + "111",
          versionNumber: 2,
        },
      ],
    });
    const dynamoPutSpy = jest.spyOn(dynamodbLib, "put");
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    const result = await getOrCreateFormTemplate(
      "local-sar-reports",
      ReportType.SAR
    );
    expect(dynamoPutSpy).toHaveBeenCalled();
    expect(s3PutSpy).toHaveBeenCalled();
    expect(result.formTemplateVersion?.versionNumber).toEqual(4);
    expect(result.formTemplateVersion?.md5Hash).toEqual(currentSARFormHash);
  });
});

describe("Test form contents", () => {
  const allFormTemplates = () => {
    const templates = [];
    for (let reportType of Object.values(ReportType)) {
      try {
        const formTemplate = formTemplateForReportType(reportType);
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
  it("Should contain fields of known types", () => {
    for (let formTemplate of allFormTemplates()) {
      for (let form of allFormsIn(formTemplate)) {
        for (let field of form.fields) {
          const isField = isFieldElement(field);
          const isLayout = isLayoutElement(field);
          if (isField && isLayout) {
            throw new Error(
              `Field '${field.id}' of type ${field.type} has confused the field type guards! Update them.`
            );
          } else if (!isField && !isLayout) {
            throw new Error(
              `Field '${field.id}' of type ${field.type} has confused the field type guards! Update them.`
            );
          }
        }
      }
    }
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
      "mock-dynamic-form-id": "dynamic",
      "mock-modal-text-field": "text",
      "mock-number-field": "number",
      "mock-text-field": "text",
    });
  });
});
