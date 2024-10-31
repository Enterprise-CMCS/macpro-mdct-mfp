/* eslint-disable no-console */
export const createdLog = (obj: any, action: string, type: string): void => {
  const { id, submissionName } = obj;
  if (id) {
    console.log(`${action} ${type} created: ${submissionName} (${id})`);
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
