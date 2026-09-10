import { EntityShape, ReportShape } from "types";

type FieldValue = any;

export interface FieldInfo {
  name: string;
  type: string;
  value?: any;
  defaultValue?: any;
  hydrationValue?: FieldValue;
}

/**
 * Current context for editing entities.
 *
 * This is a mirror of the EntityContext from EntityProvider,
 * used to allow non-components to access the Context values.
 */
export interface EntityContextShape {
  selectedEntity?: EntityShape;
  prepareEntityPayload: Function;
}

export const isFieldChanged = (field: FieldInfo) => {
  const { value, hydrationValue } = field;
  return value !== hydrationValue;
};

const convertToObject = (fields: FieldInfo[]) => {
  return fields.reduce(
    (acc: any, curr) => ((acc[curr.name] = curr.value ?? undefined), acc),
    {},
  );
};

export const autoSaveFields = async (
  report: ReportShape,
  selectedEntity: EntityShape | undefined,
  fields: FieldInfo[],
  updateReport: Function,
  userName: string,
) => {
  const newReport = structuredClone(report);
  const { fieldData } = newReport;

  const updateReportData = (
    items: any,
    fieldId: string,
    newValue: any,
    editiable: boolean,
  ) => {
    Object.entries(items).map((item) => {
      if (item[0] === fieldId && editiable) {
        items[item[0] as any] = newValue;
      } else {
        if (typeof item[1] == "object" && item[1]) {
          //TO DO: Refactor when nested pages are less wild, this can be more decoupled
          if ("id" in item[1] && item[1].id === selectedEntity?.id) {
            items[item[0]] = { ...item[1], ...convertToObject(fields) };
          } else {
            updateReportData(item[1], fieldId, newValue, editiable);
          }
        }
      }
    });
  };

  for (const field of fields) {
    updateReportData(fieldData, field.name, field.value, !selectedEntity);
  }

  const newFieldData: { [key: string]: any } = {};
  fields.forEach((field) => {
    newFieldData[field.name] = field.value;
  });

  const reportKeys = {
    reportType: report.reportType,
    id: report.id,
    state: report.state,
  };

  const newData = {
    metadata: {
      status: report.status,
      lastAlteredBy: userName,
    },
    fieldData: selectedEntity ? newReport.fieldData : newFieldData,
  };

  (await updateReport(reportKeys, newData)) as ReportShape;
  return newReport;
};
