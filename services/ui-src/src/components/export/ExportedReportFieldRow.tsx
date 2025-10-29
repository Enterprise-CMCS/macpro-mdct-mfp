// components
import { Box, Tr, Td, Text } from "@chakra-ui/react";
// types
import { FormField, FormLayoutElement, isFieldElement } from "types";
// utils
import {
  parseFormFieldInfo,
  parseCustomHtml,
  renderDataCell,
  useStore,
} from "utils";

export const ExportedReportFieldRow = ({
  formField,
  pageType,
  entityType,
  parentFieldCheckedChoiceIds,
  showHintText = true,
}: Props) => {
  const { report } = useStore();
  const reportData = report?.fieldData;
  const isDynamicField = formField.type === "dynamic";
  const formFieldInfo = parseFormFieldInfo(formField?.props);

  return (
    <Tr data-testid="exportRow">
      {/* label column/cell */}
      <Td sx={sx.labelColumn}>
        {formFieldInfo?.label || formFieldInfo?.hint ? (
          <Box data-testid="parentBoxElement">
            {formFieldInfo.label && (
              <Text sx={sx.fieldLabel}>
                {!isDynamicField
                  ? formFieldInfo?.label
                  : formField?.props?.label}
              </Text>
            )}
            {showHintText && formFieldInfo?.hint && (
              <Box sx={sx.fieldHint}>
                {parseCustomHtml(formFieldInfo?.hint)}
              </Box>
            )}
          </Box>
        ) : (
          <Text>{"N/A"}</Text>
        )}
      </Td>

      {/* data column/cell */}
      <Td>
        {reportData &&
          isFieldElement(formField) &&
          renderDataCell(
            formField,
            reportData,
            pageType,
            entityType,
            parentFieldCheckedChoiceIds
          )}
      </Td>
    </Tr>
  );
};

export interface Props {
  formField: FormField | FormLayoutElement;
  pageType: string;
  entityType?: string;
  parentFieldCheckedChoiceIds?: string[];
  showHintText?: boolean;
}

const sx = {
  numberColumn: {
    width: "5.5rem",
    paddingLeft: 0,
  },
  fieldNumber: {
    fontSize: "sm",
    fontWeight: "bold",
  },
  labelColumn: {
    width: "18rem",
    ".two-column &": {
      ".desktop &": {
        paddingLeft: "6rem",
        width: "19.5rem",
      },
    },
  },
  fieldLabel: {
    fontSize: "sm",
    fontWeight: "bold",
    marginBottom: "spacer1",
  },
  fieldHint: {
    lineHeight: "lg",
    color: "gray",
  },
};
