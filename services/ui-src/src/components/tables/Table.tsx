import { ReactNode, isValidElement } from "react";
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
import { TableContentShape, TableHeaderCellShape } from "types";
// constants
import { notAnsweredText } from "../../constants";

export const normalizeHeaderCell = (
  cell: string | TableHeaderCellShape
): TableHeaderCellShape => (typeof cell === "string" ? { title: cell } : cell);

export const Table = ({
  content,
  variant,
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
            {content.headRow.map(
              (headerCell: string | TableHeaderCellShape, index: number) => {
                const { title, colSpan, align } =
                  normalizeHeaderCell(headerCell);
                const ariaLabel = ariaOverride?.headRow?.[index]
                  ? normalizeHeaderCell(ariaOverride.headRow[index]).title
                  : undefined;

                return (
                  <Th
                    key={`${index}-head-cell`}
                    scope="col"
                    colSpan={colSpan}
                    sx={{
                      ...sxOverride,
                      ...(align && { textAlign: align }),
                    }}
                    aria-label={ariaLabel}
                  >
                    {sanitizeAndParseHtml(title)}
                  </Th>
                );
              }
            )}
          </Tr>
        </Thead>
      )}
      <Tbody sx={{ ...sxOverride }}>
        {/* if children prop is passed, just render the children */}
        {children}
        {/* if content prop is passed, parse and render rows and cells */}
        {content.bodyRows?.map((row: string[], index: number) => (
          <Tr key={`${row[0]}${index}-body-row`}>
            {row.map((cell: string, rowIndex: number) => (
              <Td
                key={`${cell}${rowIndex}-body-cell`}
                sx={{
                  color: cell == notAnsweredText ? "error_darker" : "",
                }}
                aria-label={ariaOverride?.bodyRows?.[index][rowIndex]}
              >
                {isValidElement(cell) ? cell : sanitizeAndParseHtml(cell)}
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
      <Tfoot>
        {content.footRow?.map((row: (string | ReactNode)[], index: number) => {
          return (
            <Tr key={`${row[0]}${index}-foot-row`}>
              {row.map((headerCell: any, rowIndex: number) => {
                return (
                  <Th
                    key={`${rowIndex}-foot-cell`}
                    scope="col"
                    sx={{ ...sxOverride }}
                    aria-label={ariaOverride?.footRow?.[index][rowIndex]}
                  >
                    {isValidElement(headerCell)
                      ? headerCell
                      : sanitizeAndParseHtml(headerCell)}
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
  ".two-column &": {}, // TODO: add additional styling for two-column dynamic field tables if needed
  notAnswered: {
    color: "error_darker",
  },
};
