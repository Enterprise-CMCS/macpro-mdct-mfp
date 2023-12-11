import { getPossibleFieldsFromFormTemplate } from "../formTemplates/formTemplates";
import s3Lib, { getFieldDataKey } from "../s3/s3-lib";
import { AnyObject, State } from "../types";

/**
 *
 * @param reportBucket bucket name
 * @param state state
 * @param copyFieldDataSourceId fieldDataId of source report
 * @param formTemplate form template json object
 * @param validatedFieldData validated field data from request
 */

//extra fields that needs to be copied over
const additionalFields = [
  "id",
  "type",
  "isOtherEntity",
  "isRequired",
  "isCopied",
  "isInitiativeClosed",
];

export async function copyFieldDataFromSource(
  reportBucket: string,
  state: string | undefined,
  copyFieldDataSourceId: any,
  formTemplate: any,
  validatedFieldData: AnyObject
) {
  const sourceFieldData = (await s3Lib.get({
    Bucket: reportBucket,
    Key: getFieldDataKey(state as State, copyFieldDataSourceId),
  })) as AnyObject;

  if (sourceFieldData) {
    const possibleFields = getPossibleFieldsFromFormTemplate(formTemplate);
    Object.keys(sourceFieldData).forEach((key: string) => {
      // Only iterate through entities, not choice lists
      if (Array.isArray(sourceFieldData[key])) {
        pruneEntityData(
          sourceFieldData,
          key,
          sourceFieldData[key],
          possibleFields
        );
      } else if (!possibleFields.includes(key)) {
        delete sourceFieldData[key];
      }
    });

    Object.assign(validatedFieldData, sourceFieldData);
  }

  return validatedFieldData;
}

function pruneEntityData(
  sourceFieldData: AnyObject,
  key: string,
  entityData: AnyObject[],
  possibleFields: string[]
) {
  //adding fields to be copied over from entries
  const concatEntityFields = possibleFields.concat(additionalFields);
  entityData.forEach((entity, index) => {
    // Delete any key existing in the source data not valid in our template, or any entity key that's not a name.
    if (!concatEntityFields.includes(key)) {
      delete sourceFieldData[key];
      return;
    }
    for (const entityKey in entity) {
      //check to see if the object is an array, this is for capturing substeps in the initiatives
      if (typeof entity[entityKey] === "object") {
        pruneEntityData(
          sourceFieldData,
          key,
          entity[entityKey],
          possibleFields
        );
      } else {
        if (!concatEntityFields.includes(entityKey)) {
          if (
            !entityKey.includes("name") &&
            !["key", "value"].includes(entityKey)
          ) {
            delete entityData[index][entityKey];
          }
        }
      }
    }
    if (Object.keys(entity).length === 0) {
      delete entityData[index];
    } else entityData[index]["isCopied"] = true;
  });

  //filter out any closeout data
  if (sourceFieldData && sourceFieldData[key]) {
    sourceFieldData[key] = sourceFieldData[key].filter(
      (field: AnyObject) => !field["isInitiativeClosed"]
    );
  }
  // Delete whole key if there's nothing in it.
  if (entityData.every((e) => e === null)) {
    delete sourceFieldData[key];
  }
}

export function overriderDate(copyReport:AnyObject){
  if (copyReport) {
    Date.prototype.getMonth = () => {
      //if reporting period is 1, we want to generate period 2 but returning a month in the later half of the year
      return copyReport.reportPeriod === 1 ? 11 : 2;
    };
    Date.prototype.getFullYear = () => {
      //if reporting period is 1, we want to return the same year but period 2, else next year
      return copyReport.reportPeriod === 1
        ? copyReport.reportYear
        : (copyReport.reportYear + 1);
    };
  }
}