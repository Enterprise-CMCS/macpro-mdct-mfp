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

const additionalFields = ["id", "type", "isOtherEntity"];

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
        entity[entityKey].forEach((subEntity: AnyObject, subIndex: number) => {
          for (const subEntityKey in subEntity) {
            if (!concatEntityFields.includes(subEntityKey)) {
              if (
                !subEntityKey.includes("name") &&
                !["key", "value"].includes(subEntityKey)
              ) {
                delete entityData[index][entityKey][subIndex][subEntityKey];
              }
            }
          }
        });
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
    }
  });
  // Delete whole key if there's nothing in it.
  if (entityData.every((e) => e === null)) {
    delete sourceFieldData[key];
  }
}
