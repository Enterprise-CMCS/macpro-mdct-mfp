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

// Calculate shares for expenditure tables
export const calculateShares = (
  total: number | string,
  percentage: number
): CalculatedSharesType => {
  const totalNumber = getNumberValue(total);

  // Convert currency to cents to avoid rounding errors
  const totalCents = Math.round(totalNumber * 100);
  const percentageShareCents = Math.round(totalCents * (percentage / 100));
  const remainingShareCents = totalCents - percentageShareCents;

  const percentageShare = percentageShareCents / 100;
  const remainingShare = remainingShareCents / 100;

  return {
    percentage,
    percentageShare,
    remainingShare,
    total,
  };
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
    .reduce((sum, [, val]) => {
      const n = Number(val);
      return sum + (Number.isNaN(n) ? 0 : n);
    }, 0);
};

export const isEmptyOrNaN = (value: number | string) =>
  value === "" || Number.isNaN(Number(value));

// Return number or default value for empty or NaN
export const getNumberValue = (value: number | string, defaultValue = 0) =>
  isEmptyOrNaN(value) ? defaultValue : Number(value);

// Recalculate sums in expenditure table when a field value changes
export const fieldTableTotals = ({
  fieldData,
  fieldId,
  fieldValue,
  fieldSuffixesToCalculate,
  percentage,
  tableId,
}: FieldTableTotalsType): {
  field: CalculatedSharesType;
  table: CalculatedSharesType;
} => {
  // Skip current and totals fields
  const exclusions = Object.values(fieldSuffixesToCalculate).flatMap(
    (suffix) => [`${fieldId}-${suffix}`, `${tableId}-${suffix}`]
  );

  const keys = Object.keys(fieldSuffixesToCalculate) as Array<
    keyof typeof fieldSuffixesToCalculate
  >;
  const fieldShares = calculateShares(fieldValue, percentage);
  const tableShares = keys.reduce((sum, key) => {
    const suffix = fieldSuffixesToCalculate[key];

    sum[key] =
      // Add updated current value to sum of fields with the same suffix
      getNumberValue(fieldShares[key]) +
      sumFields(fieldData, tableId, suffix, exclusions);

    return sum;
  }, {} as CalculatedSharesType);

  return {
    field: fieldShares,
    table: tableShares,
  };
};

interface FieldTableTotalsType {
  fieldData: AnyObject;
  fieldId: string;
  fieldSuffixesToCalculate: {
    percentageShare: string;
    remainingShare: string;
    total: string;
  };
  fieldValue: number | string;
  percentage: number;
  tableId: string;
}

export interface CalculatedSharesType {
  percentage: number;
  percentageShare: number;
  remainingShare: number;
  total: number | string;
}
