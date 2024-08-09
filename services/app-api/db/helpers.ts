/* eslint-disable no-console */
export const createdLog = (obj: any, type: string): void => {
  const { id, submissionName } = obj;
  console.log(`${type} created: ${submissionName} (${id})`);
};

export const expandedLog = (json: any): void => {
  console.log(JSON.stringify(json, null, 2));
};
