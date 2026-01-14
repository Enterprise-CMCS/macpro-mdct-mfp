import { AnyObject } from "types";

//summation of a row in a table, adjust the startIndex if you want to skip the first column
export const sumOfRow = (row: string[], startIndex: number = 0) => {
  if (row.length === 0) return "-";

  return row?.reduce((accumulator, currentValue, index) => {
    if (index > startIndex && isNaN(Number(currentValue))) return accumulator;

    return index > startIndex
      ? (Number(accumulator) + Number(currentValue)).toString()
      : currentValue;
  });
};

//summation of two rows in a table
export const sumOfTwoRows = (row1: string[], row2: string[]) => {
  return row1
    .map((col, index) => {
      const total = Number(col) + Number(row2[index]);
      return isNaN(total) ? "-" : total.toString();
    })
    .splice(1, row1.length);
};

//calculate the percentage of two rows in a table
export const perOfTwoRows = (row1: string[], row2: string[]) => {
  return row1
    .map((col, index) => {
      const total = (Number(col) / Number(row2[index])) * 100;
      return isNaN(total) ? "-" : total.toFixed(2) + "%";
    })
    .splice(1, row1.length);
};

// Sum fields based on matching keys
export const sumFields = (
  fieldData: AnyObject,
  startsWithId: string,
  endsWithId: string,
  exclusions: string[] = []
) => {
  return Object.entries(fieldData)
    .filter(
      ([key]) =>
        key.startsWith(startsWithId) &&
        key.endsWith(endsWithId) &&
        !exclusions.includes(key)
    )
    .reduce((sum, [, val]) => sum + Number(val || 0), 0);
};

export const fieldTableTotals = ({
  fieldValue: fieldTotalComputable,
  percentage,
  fieldId,
  tableId,
  fieldData,
}: FieldTableTotalsType) => {
  const fieldTotalFederalShare = fieldTotalComputable * (percentage / 100);
  const fieldTotalStateTerritoryShare =
    fieldTotalComputable - fieldTotalFederalShare;

  // Skip current and totals fields
  const exclusions = [
    `${fieldId}-totalComputable`,
    `${fieldId}-totalFederalShare`,
    `${fieldId}-totalStateTerritoryShare`,

    `${tableId}-totalComputable`,
    `${tableId}-totalFederalShare`,
    `${tableId}-totalStateTerritoryShare`,
  ];
  const tableTotalComputable =
    fieldTotalComputable +
    sumFields(fieldData, tableId, "totalComputable", exclusions);

  const tableTotalFederalShare =
    fieldTotalFederalShare +
    sumFields(fieldData, tableId, "totalFederalShare", exclusions);

  const tableTotalStateTerritoryShare =
    fieldTotalStateTerritoryShare +
    sumFields(fieldData, tableId, "totalStateTerritoryShare", exclusions);

  return {
    fieldTotalComputable,
    fieldTotalFederalShare,
    fieldTotalStateTerritoryShare,
    tableTotalComputable,
    tableTotalFederalShare,
    tableTotalStateTerritoryShare,
  };
};

interface FieldTableTotalsType {
  fieldValue: number;
  percentage: number;
  fieldId: string;
  tableId: string;
  fieldData: AnyObject;
}
