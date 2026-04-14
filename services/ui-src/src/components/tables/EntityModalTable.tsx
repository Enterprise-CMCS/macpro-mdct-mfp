import { useContext } from "react";
// components
import {
  Box,
  Button,
  Heading,
  Image,
  Table,
  TableCaption,
  Tbody,
  Text,
  Tfoot,
  Thead,
  VisuallyHidden,
} from "@chakra-ui/react";
import { DynamicTableContext, DynamicTableRows } from "components";
// assets
import addIcon from "assets/icons/icon_add.png";
// types
import { AnyObject, FormTable, ReportFormFieldType, ReportShape } from "types";
// utils
import { parseCustomHtml } from "utils";

export const EntityModalTable = ({
  bodyRows,
  disabled,
  dynamicRowsTemplate,
  footRows,
  formData,
  headRows,
  id: tableId,
  verbiage,
}: Props) => {
  // Modal
  const hasDynamicModalForm = !!dynamicRowsTemplate?.props?.dynamicModalForm;

  // Dynamic rows
  const { generateRows } = useContext(DynamicTableContext);

  const sharedCellProps = {
    columnCount: headRows?.[0].length || 0,
    disabled,
    dynamicRowsTemplate,
    formData,
    tableId,
  };

  const updatedFieldsCallback = (
    _dynamicId: string,
    localFieldData: AnyObject
  ) => {
    const templateFieldData =
      localFieldData?.[dynamicRowsTemplate?.id || ""] || [];
    return [
      {
        name: dynamicRowsTemplate?.id,
        type: ReportFormFieldType.DYNAMIC_OBJECT,
        value: templateFieldData,
      },
    ];
  };

  return (
    <Box sx={sx.box}>
      <Heading as="h2">{verbiage?.title}</Heading>
      {verbiage?.subtitle && (
        <Box sx={sx.subtitle}>{parseCustomHtml(verbiage.subtitle)}</Box>
      )}

      <Table id={tableId} sx={sx.table}>
        <TableCaption placement="top" sx={sx.captionBox}>
          <VisuallyHidden>{verbiage?.title}</VisuallyHidden>
        </TableCaption>
        <Thead>
          {headRows.map((row, rowIndex: number) =>
            generateRows({
              row,
              rowIndex,
              section: "thead",
              ...sharedCellProps,
            })
          )}
        </Thead>
        <Tbody>
          {bodyRows.map((row, rowIndex: number) =>
            generateRows({
              row,
              rowIndex,
              section: "tbody",
              ...sharedCellProps,
            })
          )}
          {dynamicRowsTemplate && (
            <DynamicTableRows
              disabled={disabled}
              dynamicRowsTemplate={dynamicRowsTemplate}
              emptyTableMessage={verbiage?.emptyTableMessage}
              formData={formData}
              formPercentage={0}
              hasDynamicModalForm={hasDynamicModalForm}
              hasStaticRows={bodyRows.length > 0}
              openModal={() => {}}
              tableId={tableId}
              updatedFieldsCallback={updatedFieldsCallback}
            />
          )}
        </Tbody>
        {footRows.length > 0 && (
          <Tfoot>
            {footRows.map((row, rowIndex: number) =>
              generateRows({
                row,
                rowIndex,
                section: "tfoot",
                ...sharedCellProps,
              })
            )}
          </Tfoot>
        )}
      </Table>

      {dynamicRowsTemplate && hasDynamicModalForm && (
        <>
          <Text sx={sx.dynamicRowsHint}>
            {dynamicRowsTemplate.verbiage.hint}
          </Text>
          <Button
            leftIcon={<Image sx={sx.buttonIcons} src={addIcon} alt="" />}
            onClick={() => {}}
            sx={sx.dynamicRowsButton}
            variant="outline"
          >
            {dynamicRowsTemplate.verbiage.buttonText}
          </Button>

          {/* TODO: Modal */}
        </>
      )}
    </Box>
  );
};

interface Props extends Omit<FormTable, "tableType"> {
  disabled: boolean;
  formData?: AnyObject;
  order?: number;
  report?: ReportShape;
}

export const sx = {
  error: {
    fontWeight: "bold",
    marginBottom: "spacer4",
    a: {
      color: "primary",
    },
  },
  box: {
    h2: {
      fontSize: "xl",
      marginBottom: "spacer2",
      marginTop: "spacer4",
      paddingBottom: 0,
    },
  },
  percentageText: {
    color: "gray_dark",
    fontWeight: "bold",
    paddingBottom: "spacer2",
  },
  subtitle: {
    color: "gray_dark",
    p: {
      marginBottom: "spacer2",
    },
  },
  dynamicRowsHint: {
    color: "gray_dark",
    marginBottom: "spacer2",
  },
  dynamicRowsButton: {
    marginBottom: "spacer2",
  },
  buttonIcons: {
    height: "1rem",
  },
  captionBox: {
    margin: 0,
    padding: 0,
    height: 0,
  },
  table: {
    marginBottom: "spacer5",
    marginTop: "spacer1",
    width: "68rem",
    tbody: {
      "tr:nth-of-type(even)": {
        td: {
          backgroundColor: "gray_lightest_highlight",
        },
      },
      td: {
        border: "none",
        paddingBottom: "spacer1",
        paddingInlineEnd: "spacer2",
        paddingInlineStart: "spacer2",
        paddingTop: "spacer1",
      },
      label: {
        margin: 0,
      },
    },
    tfoot: {
      td: {
        backgroundColor: "gray_lighter",
        border: "none",
        fontWeight: "bold",
        paddingInlineEnd: "spacer2",
        paddingInlineStart: "spacer2",
      },
    },
    thead: {
      th: {
        backgroundColor: "secondary_lightest",
        border: "none",
        color: "base",
        fontSize: "lg",
        letterSpacing: "normal",
        lineHeight: "normal",
        paddingBottom: "spacer1",
        paddingInlineEnd: "spacer2",
        paddingInlineStart: "spacer2",
        paddingTop: "spacer1",
        textTransform: "none",
      },
    },
  },
};
