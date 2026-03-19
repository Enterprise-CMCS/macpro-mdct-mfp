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

export const calculateAggregateTotals = (
  fieldData: AnyObject,
  fieldSuffixesToCalculate: FieldSuffixesToCalculateType,
  fieldId: string,
  tableId?: string,
  tableShares: CalculatedSharesType = {} as CalculatedSharesType
) => {
  // Return empty result if fieldData is not available
  if (!fieldData) {
    return {
      serviceTables: {
        percentageShare: 0,
        remainingShare: 0,
        total: 0,
      } as CalculatedSharesType,
      allTables: {
        percentageShare: 0,
        remainingShare: 0,
        total: 0,
      } as CalculatedSharesType,
    };
  }

  const serviceTableIds = [
    "qualifiedHcbs_statePlanServices",
    "qualifiedHcbs_1915cWaiverServices",
    "demonstrationServices_statePlanServices",
    "demonstrationServices_1915cWaiverServices",
    "supplementalServices_category",
  ];

  const allTableIds = [
    ...serviceTableIds,
    "administrativeCosts_budgetCategory",
    "administrativeCosts_capacityBuilding",
    "administrativeCosts_subRecipients",
  ];

  const keys = Object.keys(fieldSuffixesToCalculate) as Array<
    keyof FieldSuffixesToCalculateType
  >;

  const calculateForTableIds = (tableIds: string[]) => {
    const result = {} as CalculatedSharesType;

    //console.log("table ids: ", tableIds);

    //console.log("field id: ", fieldId);
    const fieldIdPrefixIdx = fieldId.lastIndexOf("_");
    const fieldIdPrefix = fieldId.substring(0, fieldIdPrefixIdx);

    //console.log("field id prefix: ", fieldIdPrefix);
    // if the changed field id is not part of the table ids, keep existing values
    if (!tableIds.includes(fieldIdPrefix)) {
      //console.log("entering");
      for (const key of keys) {
        const suffix = fieldSuffixesToCalculate[key];
        const totalCents = tableIds.reduce(
          (sum, tableId) =>
            sum + toCents(getNumberValue(fieldData[`${tableId}-${suffix}`])),
          0
        );
        result[key] = toDecimal(totalCents);
      }
      //console.log("result: ", result);
      return result;
    } else {
      for (const key of keys) {
        const suffix = fieldSuffixesToCalculate[key];
        //console.log("suffix: ", suffix);
        const totalCents = tableIds
          .filter((t) => t !== tableId)
          .reduce(
            (sum, tableId) =>
              sum + toCents(getNumberValue(fieldData[`${tableId}-${suffix}`])),
            0
          );
        result[key] = toDecimal(
          totalCents + toCents(getNumberValue(tableShares[key]))
        );
      }
    }

    return result;
  };

  return {
    serviceTables: calculateForTableIds(serviceTableIds),
    allTables: calculateForTableIds(allTableIds),
  };
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
  serviceTables: CalculatedSharesType;
  allTables: CalculatedSharesType;
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

  //console.log("field data: ", fieldData);
  //console.log("field id: ", fieldId);
  //console.log("table id: ", tableId);
  //console.log("table shares: ", tableShares);
  //console.log("field suffixes: ", fieldSuffixesToCalculate);

  const { serviceTables, allTables } = calculateAggregateTotals(
    fieldData,
    fieldSuffixesToCalculate,
    fieldId,
    tableId,
    tableShares
  );

  return {
    field: fieldShares,
    table: tableShares,
    serviceTables,
    allTables,
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
  serviceTables: CalculatedSharesType;
  allTables: CalculatedSharesType;
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

  const { serviceTables, allTables } = calculateAggregateTotals(
    fieldData,
    fieldSuffixesToCalculate,
    dynamicFieldId,
    tableId,
    tableShares
  );

  return {
    field: fieldShares,
    table: tableShares,
    template: templateShares,
    serviceTables,
    allTables,
  };
};

export const combinedSum = (values: number[]) => {
  const totalCents = values.reduce((sum, val) => {
    const n = Number(val);
    return sum + (Number.isNaN(n) ? 0 : toCents(n));
  }, 0);

  return toDecimal(totalCents);
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
