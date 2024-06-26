import { getReportFieldData } from "../../storage/reports";
import { getPossibleFieldsFromFormTemplate } from "../formTemplates/formTemplates";
import { AnyObject, ReportFieldData, ReportJson, State } from "../types";

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
  state: State,
  copyFieldDataSourceId: string,
  formTemplate: ReportJson,
  validatedFieldData: ReportFieldData
) {
  const sourceFieldData = await getReportFieldData({
    reportType: formTemplate.type,
    state,
    fieldDataId: copyFieldDataSourceId,
  });

  if (sourceFieldData) {
    const possibleFields = getPossibleFieldsFromFormTemplate(formTemplate);
    Object.keys(sourceFieldData).forEach((key: string) => {
      // Only iterate through entities, not choice lists
      if (Array.isArray(sourceFieldData[key])) {
        pruneEntityData(
          sourceFieldData,
          key,
          sourceFieldData[key] as AnyObject[], // TODO, remove cast
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
  sourceFieldData: AnyObject, // TODO, make this ReportFieldData
  key: string,
  entityData: AnyObject[], // TODO, make this Choice[] | ReportFieldData[]
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
