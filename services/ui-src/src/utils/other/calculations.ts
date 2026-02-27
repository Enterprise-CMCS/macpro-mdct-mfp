import { AnyObject, DynamicFieldShape } from "types";

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

const toCents = (num: number) => Math.round(num * 100);
const toDecimal = (num: number) => num / 100;

// Calculate shares for expenditure tables
export const calculateShares = (
  total: number | string,
  percentage: number
): CalculatedSharesType => {
  const totalNumber = getNumberValue(total);

  // Convert currency to cents to avoid rounding errors
  const totalCents = toCents(totalNumber);
  const percentageShareCents = Math.round(totalCents * toDecimal(percentage));
  const remainingShareCents = totalCents - percentageShareCents;

  const percentageShare = toDecimal(percentageShareCents);
  const remainingShare = toDecimal(remainingShareCents);

  return {
    percentage,
    percentageShare,
    remainingShare,
    total,
  };
};

// Sum fields based on matching keys
export const sumFields = (
  fieldData: AnyObject = {},
  startsWithId: string,
  endsWithId: string,
  exclusions: string[] = []
) => {
  const totalCents = Object.entries(fieldData)
    .filter(
      ([key]) =>
        key.startsWith(startsWithId) &&
        key.endsWith(endsWithId) &&
        !exclusions.includes(key)
    )
    .reduce((sum, [, val]) => {
      if (Array.isArray(val)) {
        return (
          sum +
          val.reduce((innerSum: number, item: AnyObject) => {
            const n = Number(item.name);
            return innerSum + (Number.isNaN(n) ? 0 : toCents(n));
          }, 0)
        );
      }

      const n = Number(val);
      return sum + (Number.isNaN(n) ? 0 : toCents(n));
    }, 0);

  return toDecimal(totalCents);
};

export const sumDynamicFields = (values: DynamicFieldShape[], key: string) => {
  const totalCents = values.reduce((sum, value) => {
    const n = Number(value[key]);
    return sum + (Number.isNaN(n) ? 0 : toCents(n));
  }, 0);

  return toDecimal(totalCents);
};

export const isEmptyOrNaN = (value: number | string) =>
  value === "" || Number.isNaN(Number(value));

// Return number or default value for empty or NaN
export const getNumberValue = (value: number | string, defaultValue = 0) =>
  isEmptyOrNaN(value) ? defaultValue : Number(value);

const sumSharesBySuffix = (
  keys: Array<keyof FieldSuffixesToCalculateType>,
  fieldShares: CalculatedSharesType,
  getCurrentSum: (key: keyof FieldSuffixesToCalculateType) => number
): CalculatedSharesType => {
  return keys.reduce((sum, key) => {
    const currentValue = getNumberValue(fieldShares[key]);
    const currentSum = getCurrentSum(key);

    const totalCents = toCents(currentValue) + toCents(currentSum);
    sum[key] = toDecimal(totalCents);

    return sum;
  }, {} as CalculatedSharesType);
};

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
  const tableShares = sumSharesBySuffix(keys, fieldShares, (key) =>
    sumFields(fieldData, tableId, fieldSuffixesToCalculate[key], exclusions)
  );

  return {
    field: fieldShares,
    table: tableShares,
  };
};

export const dynamicFieldTableTotals = ({
  fieldData,
  dynamicFieldId,
  dynamicTemplateId,
  fieldValue,
  fieldSuffixesToCalculate,
  percentage,
  tableId,
}: DynamicFieldTableTotalsType): {
  field: CalculatedSharesType;
  table: CalculatedSharesType;
  template: CalculatedSharesType;
} => {
  // Skip current and totals fields
  const exclusions = Object.values(fieldSuffixesToCalculate).flatMap(
    (suffix) => [`${dynamicTemplateId}-${suffix}`, `${tableId}-${suffix}`]
  );

  const keys = Object.keys(fieldSuffixesToCalculate) as Array<
    keyof FieldSuffixesToCalculateType
  >;
  const fieldShares = calculateShares(fieldValue, percentage);

  const rows = fieldData?.[dynamicTemplateId] || [];
  const rowsToCalculate = rows.filter(
    (row: DynamicFieldShape) => row.id !== dynamicFieldId
  );

  const templateShares = sumSharesBySuffix(keys, fieldShares, (key) =>
    sumDynamicFields(rowsToCalculate, fieldSuffixesToCalculate[key])
  );

  const tableShares = sumSharesBySuffix(keys, templateShares, (key) =>
    sumFields(fieldData, tableId, fieldSuffixesToCalculate[key], exclusions)
  );

  return {
    field: fieldShares,
    table: tableShares,
    template: templateShares,
  };
};

interface DynamicFieldTableTotalsType {
  fieldData: AnyObject;
  dynamicFieldId: string;
  dynamicTemplateId: string;
  fieldSuffixesToCalculate: FieldSuffixesToCalculateType;
  fieldValue: number | string;
  percentage: number;
  tableId: string;
}

interface FieldTableTotalsType {
  fieldData: AnyObject;
  fieldId: string;
  fieldSuffixesToCalculate: FieldSuffixesToCalculateType;
  fieldValue: number | string;
  percentage: number;
  tableId: string;
}

interface FieldSuffixesToCalculateType {
  percentageShare: string;
  remainingShare: string;
  total: string;
}

export interface CalculatedSharesType {
  percentage: number;
  percentageShare: number | string;
  remainingShare: number | string;
  total: number | string;
}
