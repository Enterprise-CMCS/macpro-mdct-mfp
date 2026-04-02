import {
  AnyObject,
  BuildServiceField,
  DynamicRowsTemplateVerbiage,
  FormJson,
  NumberMask,
  ReportFormFieldType,
  ServiceField,
  ServiceFieldType,
  ValidationComparator,
  ValidationType,
} from "../types";

export const buildServiceFields = (
  service: ServiceField,
  fieldsToReturn: ServiceFieldType[] = [
    ServiceFieldType.TOTAL_COMPUTABLE,
    ServiceFieldType.TOTAL_STATE_TERRITORY_SHARE,
    ServiceFieldType.TOTAL_FEDERAL_SHARE,
  ],
  settings?: AnyObject
) => {
  const buildServiceField = ({
    suffix,
    label,
    props,
    options,
  }: BuildServiceField) => ({
    forTableOnly: true,
    id: `${service.id}-${suffix}`,
    type: ReportFormFieldType.NUMBER,
    validation: ValidationType.NUMBER_OPTIONAL,
    ...options,
    props: {
      label: `${service.label} ${label}`,
      ...props,
    },
  });

  const currencyProps = {
    decimalPlacesToRoundTo: 2,
    initialValue: "0",
    mask: NumberMask.CURRENCY,
    readOnly: true,
  };

  const fields = [];

  for (const fieldType of fieldsToReturn) {
    switch (fieldType) {
      case ServiceFieldType.CATEGORY:
        fields.push(
          buildServiceField({
            suffix: "category",
            label: "Category",
            props: {
              dynamicLabel: settings?.dynamicLabel,
              ...settings?.[ServiceFieldType.CATEGORY]?.props,
            },
            options: {
              type: ReportFormFieldType.TEXT,
              validation: ValidationType.TEXT_OPTIONAL,
              ...settings?.[ServiceFieldType.CATEGORY]?.options,
            },
          })
        );
        break;

      case ServiceFieldType.NAME:
        fields.push(
          buildServiceField({
            suffix: "name",
            label: "Name",
            props: {
              readOnly: service.readOnly,
              ...settings?.[ServiceFieldType.NAME]?.props,
            },
            options: {
              type: ReportFormFieldType.TEXT,
              validation: ValidationType.TEXT,
              ...settings?.[ServiceFieldType.NAME]?.options,
            },
          })
        );
        break;

      case ServiceFieldType.DESCRIPTION:
        fields.push(
          buildServiceField({
            suffix: "description",
            label: "Description",
            props: {
              readOnly: service.readOnly,
              ...settings?.[ServiceFieldType.DESCRIPTION]?.props,
            },
            options: {
              type: ReportFormFieldType.TEXTAREA,
              validation: ValidationType.TEXT,
              ...settings?.[ServiceFieldType.DESCRIPTION]?.options,
            },
          })
        );
        break;

      case ServiceFieldType.TOTAL_COMPUTABLE:
        fields.push(
          buildServiceField({
            suffix: "totalComputable",
            label: "Total Computable",
            props: {
              ...currencyProps,
              initialValue: service.readOnly ? "0" : "",
              readOnly: service.readOnly,
              ...settings?.[ServiceFieldType.TOTAL_COMPUTABLE]?.props,
            },
            options: {
              ...settings?.[ServiceFieldType.TOTAL_COMPUTABLE]?.options,
            },
          })
        );
        break;

      case ServiceFieldType.PERCENTAGE_OVERRIDE:
        fields.push(
          buildServiceField({
            suffix: "percentageOverride",
            label: "Override %",
            props: {
              decimalPlacesToRoundTo: 0,
              mask: NumberMask.PERCENTAGE,
              readOnly: service.readOnly,
              ...settings?.[ServiceFieldType.PERCENTAGE_OVERRIDE]?.props,
            },
            options: {
              validation: {
                type: ValidationType.NUMBER_COMPARISON_OPTIONAL,
                options: {
                  boundary: 100,
                  comparator:
                    ValidationComparator.LESS_THAN_OR_EQUAL_PERCENTAGE,
                },
              },
              ...settings?.[ServiceFieldType.PERCENTAGE_OVERRIDE]?.options,
            },
          })
        );
        break;

      case ServiceFieldType.TOTAL_STATE_TERRITORY_SHARE:
        fields.push(
          buildServiceField({
            suffix: "totalStateTerritoryShare",
            label: "Total State / Territory Share",
            props: {
              ...currencyProps,
              ...settings?.[ServiceFieldType.TOTAL_STATE_TERRITORY_SHARE]
                ?.props,
            },
            options: {
              ...settings?.[ServiceFieldType.TOTAL_STATE_TERRITORY_SHARE]
                ?.options,
            },
          })
        );
        break;

      case ServiceFieldType.TOTAL_FEDERAL_SHARE:
        fields.push(
          buildServiceField({
            suffix: "totalFederalShare",
            label: "Total Federal Share",
            props: {
              ...currencyProps,
              ...settings?.[ServiceFieldType.TOTAL_FEDERAL_SHARE]?.props,
            },
            options: {
              ...settings?.[ServiceFieldType.TOTAL_FEDERAL_SHARE]?.options,
            },
          })
        );
        break;

      case ServiceFieldType.TITLE:
        fields.push(
          buildServiceField({
            suffix: "title",
            label: "Position Title",
            props: {
              ...settings?.[ServiceFieldType.TITLE]?.props,
            },
            options: {
              type: ReportFormFieldType.TEXT,
              validation: ValidationType.TEXT_OPTIONAL,
              ...settings?.[ServiceFieldType.TITLE]?.options,
            },
          })
        );
        break;

      case ServiceFieldType.BUDGETED_FTES:
        fields.push(
          buildServiceField({
            suffix: "budgetedFullTimeEmployees",
            label: "# of Budgeted FTEs",
            props: {
              decimalPlacesToRoundTo: 2,
              initialValue: service.readOnly ? "0" : "",
              mask: NumberMask.FLOAT_OR_INTEGER,
              readOnly: service.readOnly,
              ...settings?.[ServiceFieldType.BUDGETED_FTES]?.props,
            },
            options: {
              ...settings?.[ServiceFieldType.BUDGETED_FTES]?.options,
            },
          })
        );
        break;

      case ServiceFieldType.FILLED_FTES:
        fields.push(
          buildServiceField({
            suffix: "filledFullTimeEmployees",
            label: "# of Filled FTEs",
            props: {
              decimalPlacesToRoundTo: 2,
              initialValue: service.readOnly ? "0" : "",
              mask: NumberMask.FLOAT_OR_INTEGER,
              readOnly: service.readOnly,
              ...settings?.[ServiceFieldType.FILLED_FTES]?.props,
            },
            options: {
              ...settings?.[ServiceFieldType.FILLED_FTES]?.options,
            },
          })
        );
        break;

      default:
        break;
    }
  }

  return fields;
};

export const tableFieldBuilder = (
  service: ServiceField,
  fields: AnyObject[]
) => {
  return fields.map((f) => {
    return {
      forTableOnly: true,
      id: `${service.id}-${f.id}`,
      type: ReportFormFieldType.TEXT,
      validation: ValidationType.TEXT,
      ...f.options,
      props: {
        readOnly: service.readOnly,
        ...f.props,
      },
    };
  });
};

const dynamicRowsTemplateBuilder = ({
  dynamicFieldValidations,
  dynamicFieldsCallback,
  dynamicFieldsBodyList,
  dynamicModalForm,
  dynamicRowId,
  label,
  verbiage,
}: DynamicRowsTemplateBuilder) => {
  const dynamicModalFormProps = dynamicModalForm ? { dynamicModalForm } : {};

  return {
    forTableOnly: true,
    id: dynamicRowId,
    props: {
      label,
      dynamicFields: dynamicFieldsBodyList.flatMap((service) =>
        dynamicFieldsCallback(service)
      ),
      ...dynamicModalFormProps,
    },
    type: ReportFormFieldType.DYNAMIC_OBJECT,
    validation: {
      type: ValidationType.DYNAMIC_OPTIONAL,
      options: {
        dynamicFieldValidations,
      },
    },
    verbiage,
  };
};

export const serviceFieldDynamicRowsTemplateBuilder = ({
  dynamicFieldsBodyList,
  dynamicFieldsSettings,
  dynamicFieldsToReturn,
  dynamicFieldValidations,
  dynamicModalList,
  dynamicModalFieldsSettings,
  dynamicModalFieldsToReturn,
  dynamicModalVerbiage,
  dynamicRowId,
  label,
  verbiage,
}: ServiceFieldDynamicRowsTemplateBuilder) => {
  const dynamicModalForm = dynamicModalList
    ? {
        id: `${dynamicRowId}-modalForm`,
        heading: dynamicModalVerbiage,
        fields: dynamicModalList.flatMap((service) =>
          buildServiceFields(
            service,
            dynamicModalFieldsToReturn,
            dynamicModalFieldsSettings
          )
        ),
      }
    : undefined;

  return dynamicRowsTemplateBuilder({
    dynamicFieldValidations,
    dynamicFieldsBodyList,
    dynamicFieldsCallback: (service: ServiceField) =>
      buildServiceFields(service, dynamicFieldsToReturn, dynamicFieldsSettings),
    dynamicModalForm,
    dynamicRowId,
    label,
    verbiage,
  });
};

export const tableFieldDynamicRowsTemplateBuilder = ({
  dynamicFieldsBodyList,
  dynamicFieldsToReturn,
  dynamicFieldValidations,
  dynamicRowId,
  dynamicModalList,
  dynamicModalFieldsToReturn,
  dynamicModalVerbiage,
  label,
  verbiage,
}: TableFieldDynamicRowsTemplateBuilder) => {
  const dynamicModalForm =
    dynamicModalList && dynamicModalFieldsToReturn
      ? {
          id: `${dynamicRowId}-modalForm`,
          heading: dynamicModalVerbiage,
          fields: dynamicModalList.flatMap((service) =>
            tableFieldBuilder(service, dynamicModalFieldsToReturn)
          ),
        }
      : undefined;

  return dynamicRowsTemplateBuilder({
    dynamicFieldValidations,
    dynamicFieldsBodyList,
    dynamicFieldsCallback: (service: ServiceField) =>
      tableFieldBuilder(service, dynamicFieldsToReturn),
    dynamicModalForm,
    dynamicRowId,
    label,
    verbiage,
  });
};

interface DynamicRowsTemplateBuilder {
  dynamicFieldValidations: AnyObject;
  dynamicFieldsBodyList: ServiceField[];
  dynamicFieldsCallback: Function;
  dynamicModalForm?: FormJson;
  dynamicRowId: string;
  label: string;
  verbiage: DynamicRowsTemplateVerbiage;
}

interface FieldDynamicRowsTemplateBuilder {
  dynamicFieldValidations: AnyObject;
  dynamicFieldsBodyList: ServiceField[];
  dynamicModalList?: ServiceField[];
  dynamicModalVerbiage?: AnyObject;
  dynamicRowId: string;
  label: string;
  verbiage: DynamicRowsTemplateVerbiage;
}

interface ServiceFieldDynamicRowsTemplateBuilder extends FieldDynamicRowsTemplateBuilder {
  dynamicFieldsSettings?: AnyObject;
  dynamicFieldsToReturn: ServiceFieldType[];
  dynamicModalFieldsSettings?: AnyObject;
  dynamicModalFieldsToReturn?: ServiceFieldType[];
}

interface TableFieldDynamicRowsTemplateBuilder extends FieldDynamicRowsTemplateBuilder {
  dynamicFieldsToReturn: AnyObject[];
  dynamicModalFieldsToReturn?: AnyObject[];
}
