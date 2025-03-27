/* eslint-disable no-console */
export const createdLog = (obj: any, action: string, type: string): void => {
  const { id, key, submissionName, title } = obj;
  if (id || key) {
    console.log(
      `${action} ${type} created: ${submissionName || title} (${id || key})`
    );
  } else {
    console.log(`ℹ️ ${obj}`);
    console.log(
      `⚠️ Could not create ${action.toLowerCase()} ${type} for reporting period.`
    );
  }
};

export const expandedLog = (json: any): void => {
  console.log(JSON.stringify(json, null, 2));
};

export const generateReportingPeriod = (year: number, period: number) =>
  `${year} Period ${period}`;
