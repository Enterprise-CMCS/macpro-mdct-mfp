import { ReactNode } from "react";
// components
import { Box, Link, Text } from "@chakra-ui/react";
// types
import { AnyObject, Choice, EntityShape, FieldChoice, FormField } from "types";
// utils
import { getReportVerbiage, maskResponseData } from "utils";

// checks for type of data cell to be render and calls the appropriate renderer
export const renderDataCell = (
  formField: FormField,
  allResponseData: AnyObject,
  pageType: string,
  entityType?: string,
  parentFieldCheckedChoiceIds?: string[]
) => {
  // render drawer data cell (list entities & per-entity responses)
  if (pageType === "drawer") {
    const entityResponseData = allResponseData[entityType!];
    return renderDrawerDataCell(
      formField,
      entityResponseData,
      parentFieldCheckedChoiceIds
    );
  }
  // render dynamic field data cell (list dynamic field entities)
  if (formField.type === "dynamic") {
    const fieldResponseData = allResponseData[formField.id];
    return renderDynamicDataCell(fieldResponseData);
  }
  // render standard data cell (just field response data)
  const fieldResponseData = allResponseData[formField.id];
  return renderResponseData(formField, fieldResponseData);
};

export const renderOverlayEntityDataCell = (
  formField: FormField,
  entityResponseData: EntityShape[],
  entityId: string,
  parentFieldCheckedChoiceIds?: string[]
) => {
  const entity = entityResponseData.find((ent) => ent.id === entityId);
  const { exportVerbiage } = getReportVerbiage();
  const {
    missingEntry: { noResponse },
  } = exportVerbiage;

  if (!entity || !entity[formField.id]) {
    const validationType =
      typeof formField.validation === "object"
        ? formField.validation.type
        : formField.validation;

    if (validationType.includes("Optional")) {
      return <Text>{noResponse}, optional</Text>;
    } else {
      return <Text sx={sx.noResponse}>{noResponse}; required</Text>;
    }
  }

  const notApplicable =
    parentFieldCheckedChoiceIds &&
    !parentFieldCheckedChoiceIds?.includes(entity.id);
  return (
    <Box>
      {renderResponseData(formField, entity[formField.id], notApplicable)}
    </Box>
  );
};

export const renderDrawerDataCell = (
  formField: FormField,
  entityResponseData: AnyObject | undefined,
  parentFieldCheckedChoiceIds?: string[]
) => {
  const { exportVerbiage } = getReportVerbiage();
  return (
    entityResponseData?.map((entity: EntityShape) => {
      const notApplicable =
        parentFieldCheckedChoiceIds &&
        !parentFieldCheckedChoiceIds?.includes(entity.id);
      const fieldResponseData = entity[formField.id];
      return (
        <Box key={entity.id + formField.id} sx={sx.entityBox}>
          <ul>
            <li>
              <Text sx={sx.entityName}>{entity.name}</Text>
            </li>
            <li className="entityResponse">
              {renderResponseData(formField, fieldResponseData, notApplicable)}
            </li>
          </ul>
        </Box>
      );
    }) ?? (
      <Text sx={sx.noResponse}>{exportVerbiage.missingEntry.noResponse}</Text>
    )
  );
};

export const renderDynamicDataCell = (fieldResponseData: AnyObject) => {
  const { exportVerbiage } = getReportVerbiage();
  return (
    fieldResponseData?.map((entity: EntityShape) => (
      <Text key={entity.id} sx={sx.dynamicItem}>
        {entity.name}
      </Text>
    )) ?? (
      <Text sx={sx.noResponse}>{exportVerbiage.missingEntry.noResponse}</Text>
    )
  );
};

export const renderResponseData = (
  formField: FormField,
  fieldResponseData: any,
  notApplicable?: boolean
) => {
  const isChoiceListField = ["checkbox", "radio"].includes(formField.type);
  const { exportVerbiage } = getReportVerbiage();
  // check for and handle no response
  const hasResponse: boolean = isChoiceListField
    ? fieldResponseData?.length
    : fieldResponseData;
  const missingEntryVerbiage = notApplicable
    ? exportVerbiage.missingEntry.notApplicable
    : exportVerbiage.missingEntry.noResponse;
  const missingEntryStyle = notApplicable ? sx.notApplicable : sx.noResponse;
  if (!hasResponse)
    return <Text sx={missingEntryStyle}>{missingEntryVerbiage}; required</Text>;
  // handle choice list fields (checkbox, radio)
  if (isChoiceListField) {
    return renderChoiceListFieldResponse(formField, fieldResponseData);
  }
  // check for and handle link fields (email, url)
  const { isLink, isEmail } = checkLinkTypes(formField);
  if (isLink) return renderLinkFieldResponse(fieldResponseData, isEmail);
  // handle all other field types
  return renderDefaultFieldResponse(formField, fieldResponseData);
};

export const renderChoiceListFieldResponse = (
  formField: FormField,
  fieldResponseData: AnyObject
) => {
  // filter potential choices to just those that are selected
  const potentialFieldChoices = formField.props?.choices;
  const selectedChoices = potentialFieldChoices.filter(
    (potentialChoice: FieldChoice) => {
      return fieldResponseData?.find((element: Choice) =>
        element.key.includes(potentialChoice.id)
      );
    }
  );
  const choicesToDisplay = selectedChoices?.map((choice: FieldChoice) => {
    return (
      <Text key={choice.id} sx={sx.fieldChoice}>
        {choice.label}
      </Text>
    );
  });
  return choicesToDisplay;
};

export const renderLinkFieldResponse = (
  fieldResponseData: ReactNode,
  isEmail: boolean
) => (
  <Link href={(isEmail ? "mailto:" : "") + fieldResponseData} target="_blank">
    {fieldResponseData}
  </Link>
);

export const renderDefaultFieldResponse = (
  formField: FormField,
  fieldResponseData: ReactNode
) => {
  // check and handle fields that need a mask applied
  const fieldMask = formField.props?.mask;
  if (fieldMask)
    return <Text>{maskResponseData(fieldResponseData, fieldMask)}</Text>;
  // render all other fields
  return <Text>{fieldResponseData}</Text>;
};

// check for and handle link fields (email, url)
export const checkLinkTypes = (formField: FormField) => {
  const emailTypes = ["email", "emailOptional"];
  const urlTypes = ["url", "urlOptional"];
  const linkTypes = [...emailTypes, ...urlTypes];
  const fieldValidationType =
    typeof formField?.validation === "string"
      ? formField.validation
      : formField.validation?.type;
  return {
    isLink: linkTypes.includes(fieldValidationType ?? ""),
    isEmail: emailTypes.includes(fieldValidationType ?? ""),
  };
};

// parse field info from field props
export const parseFormFieldInfo = (formFieldProps?: AnyObject) => {
  if (
    formFieldProps === undefined ||
    Object.values(formFieldProps).every((x) => typeof x === "undefined")
  )
    return {};
  const labelArray = formFieldProps?.label?.split(" ");

  return {
    number: labelArray?.[0].match(/[-.0-9]+/) ? labelArray?.[0] : "N/A",
    label: labelArray?.[0].match(/[-.0-9]+/)
      ? labelArray?.slice(1)?.join(" ")
      : labelArray?.join(" "),
    hint: formFieldProps?.hint,
    indicator: formFieldProps?.indicator,
    choices: formFieldProps?.choices,
  };
};

// style object for rendered elements
const sx = {
  fieldChoice: {
    marginBottom: "spacer2",
  },
  dynamicItem: {
    marginBottom: "spacer2",
  },
  entityBox: {
    verticalAlign: "top",
    marginBottom: "spacer2",
    ul: {
      listStyle: "none",
      ".entityResponse": {
        paddingBottom: "spacer1",
        p: {
          lineHeight: "1.25rem",
          fontSize: "sm",
        },
      },
      p: {
        lineHeight: "1.25rem",
        marginBottom: "spacer1",
      },
    },
    "&:last-of-type": {
      marginBottom: 0,
    },
  },
  entityName: {
    marginBottom: "spacer2",
    fontWeight: "bold",
  },
  noResponse: {
    color: "error_darker",
  },
  notApplicable: {
    color: "gray",
  },
};
