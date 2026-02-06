import { ReactNode } from "react";
// components
import {
  SystemStyleObject,
  Table as TableRoot,
  TableCaption,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  VisuallyHidden,
} from "@chakra-ui/react";
// utils
import { sanitizeAndParseHtml } from "utils";
// types
import { TableContentShape } from "types";
// constants
import { notAnsweredText } from "../../constants";

export const Table = ({
  content,
  variant,
  border,
  sxOverride,
  ariaOverride,
  children,
  ...props
}: Props) => {
  return (
    <TableRoot
      variant={variant}
      size="sm"
      sx={{ ...sx.root, ...sxOverride }}
      {...props}
    >
      <TableCaption placement="top" sx={sx.captionBox}>
        <VisuallyHidden>{content.caption}</VisuallyHidden>
      </TableCaption>
      {content.headRow && (
        <Thead>
          {/* Head Row */}
          <Tr>
            {content.headRow.map((headerCell: string, index: number) => (
              <Th
                key={`${index}-head-cell`}
                scope="col"
                sx={{ ...sx.tableHeader, ...sxOverride }}
                aria-label={ariaOverride?.headRow?.[index]}
              >
                {sanitizeAndParseHtml(headerCell)}
              </Th>
            ))}
          </Tr>
        </Thead>
      )}
      <Tbody sx={{ ...sxOverride }}>
        {/* if children prop is passed, just render the children */}
        {children}
        {/* if content prop is passed, parse and render rows and cells */}
        {content.bodyRows &&
          content.bodyRows!.map((row: string[], index: number) => (
            <Tr key={`${row[0]}${index}-body-row`}>
              {row.map((cell: string, rowIndex: number) => (
                <Td
                  key={`${cell}${rowIndex}-body-cell`}
                  sx={{
                    tableCell: border ? sx.tableCellBorder : sx.tableCell,
                    color: cell == notAnsweredText ? "error_darker" : "",
                  }}
                  aria-label={ariaOverride?.bodyRows?.[index][rowIndex]}
                >
                  {sanitizeAndParseHtml(cell)}
                </Td>
              ))}
            </Tr>
          ))}
      </Tbody>
      <Tfoot>
        {content.footRow &&
          content.footRow?.map((row: string[], index: number) => {
            return (
              <Tr key={`${row[0]}${index}-foot-row`}>
                {row.map((headerCell: string, rowIndex: number) => {
                  return (
                    <Th
                      key={`${rowIndex}-foot-cell`}
                      scope="col"
                      sx={{ ...sx.tableHeader, ...sxOverride }}
                      aria-label={ariaOverride?.footRow?.[index][rowIndex]}
                    >
                      {sanitizeAndParseHtml(headerCell)}
                    </Th>
                  );
                })}
              </Tr>
            );
          })}
      </Tfoot>
    </TableRoot>
  );
};

interface Props {
  content: TableContentShape;
  variant?: string;
  border?: boolean;
  sxOverride?: SystemStyleObject;
  ariaOverride?: TableContentShape;
  children?: ReactNode;
  [key: string]: any;
}

const sx = {
  root: {
    width: "100%",
  },
  captionBox: {
    margin: 0,
    padding: 0,
    height: 0,
  },
  tableHeader: {
    padding: "0.75rem 0.5rem",
    fontSize: "sm",
    fontWeight: "semibold",
    borderColor: "gray_lighter",
    textTransform: "none",
    letterSpacing: "normal",
    ".mobile &": {
      fontSize: "xs",
    },
  },
  tableCell: {
    padding: "0.75rem 0.5rem",
    borderStyle: "none",
    fontWeight: "normal",
    ".mobile &": {
      fontSize: "xs",
    },
  },
  tableCellBorder: {
    padding: "0.75rem 0.5rem",
    borderBottom: "1px solid",
    borderColor: "gray_lighter",
    fontWeight: "normal",
    ".mobile &": {
      fontSize: "xs",
    },
  },
  ".two-column &": {}, // TODO: add additional styling for two-column dynamic field tables if needed
  notAnswered: {
    color: "error_darker",
  },
};
