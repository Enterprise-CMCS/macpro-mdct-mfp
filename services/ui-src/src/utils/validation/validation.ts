import { nested, endDate, schemaMap } from "./schemas";
import { AnyObject, ValidationType } from "types";

// map field validation types to validation schema
export const mapValidationTypesToSchema = (fieldValidationTypes: AnyObject) => {
  let validationSchema: AnyObject = {};
  // for each field to be validated,
  Object.entries(fieldValidationTypes).forEach(
    (fieldValidationType: [string, string | AnyObject]) => {
      const [key, fieldValidation] = fieldValidationType;
      // if standard validation type, set corresponding schema from map
      if (typeof fieldValidation === "string") {
        const correspondingSchema = schemaMap[fieldValidation];
        if (correspondingSchema) {
          validationSchema[key] =
            typeof correspondingSchema === "function"
              ? correspondingSchema()
              : correspondingSchema;
        }
      }
      // else if custom validation type with options
      else if (fieldValidation?.options && !fieldValidation?.nested) {
        const correspondingSchema = schemaMap[fieldValidation.type];
        if (correspondingSchema) {
          validationSchema[key] = correspondingSchema(fieldValidation.options);
        }
      }
      // else if nested validation type, make and set nested schema
      else if (fieldValidation?.nested) {
        validationSchema[key] = makeNestedFieldSchema(fieldValidation);

        // else if not nested, make and set other dependent field types
      } else if (fieldValidation?.type === ValidationType.END_DATE) {
        validationSchema[key] = makeEndDateFieldSchema(fieldValidation);
      }
    }
  );
  return validationSchema;
};

// return created endDate schema
export const makeEndDateFieldSchema = (fieldValidationObject: AnyObject) => {
  const { dependentFieldName } = fieldValidationObject;
  return endDate(dependentFieldName);
};

// return created nested field schema
export const makeNestedFieldSchema = (fieldValidationObject: AnyObject) => {
  const { options, parentFieldName, parentOptionId, type } =
    fieldValidationObject;

  if (type === ValidationType.END_DATE) {
    return nested(
      () => makeEndDateFieldSchema(fieldValidationObject),
      parentFieldName,
      parentOptionId
    );
  } else {
    const correspondingSchema = schemaMap[type];
    const fieldValidationSchema = options
      ? correspondingSchema(options)
      : correspondingSchema;

    return nested(() => fieldValidationSchema, parentFieldName, parentOptionId);
  }
};
