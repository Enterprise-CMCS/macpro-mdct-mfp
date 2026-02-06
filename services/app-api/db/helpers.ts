export const createdLog = (obj: any, action: string, type: string): void => {
  const { id, key, submissionName, title, Item } = obj;
  if (id || key || Item) {
    console.log(
      `${action} ${type} created: ${submissionName || title || Item.title} (${
        id || key || Item.key
      })`
    );
  } else {
    console.log(`ℹ️ ${obj}`);
    console.log(`⚠️ Could not create ${action.toLowerCase()} ${type}.`);
  }
};

export const expandedLog = (json: any): void => {
  console.log(JSON.stringify(json, null, 2));
};

export const generateReportingPeriod = (year: number, period: number) =>
  `${year} Period ${period}`;
