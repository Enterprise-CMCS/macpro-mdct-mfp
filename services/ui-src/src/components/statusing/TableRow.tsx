import { Td, Text, Tr } from "@chakra-ui/react";
import { ReportPageProgress, ReportType } from "types";
import { useBreakpoint, useStore } from "utils";
import { EditButton } from "./EditButton";
import { StatusIcon } from "./StatusIcon";

export const TableRow = ({ page, rowDepth }: RowProps) => {
  const { isMobile } = useBreakpoint();
  const { name, path, children, status } = page;
  const { report, editable } = useStore();
  const buttonAriaLabel = editable ? `Edit  ${name}` : `View  ${name}`;

  const isMobileAndNotChildEditButton =
    isMobile && !children && EditButton({ buttonAriaLabel, path, editable });

  const notChildEditButton =
    !children &&
    EditButton({ buttonAriaLabel, path, editable, showIcon: true });

  const parentPl = !isMobile ? "1rem" : "0";
  const subparentPl = !isMobile ? `${1.25 * rowDepth}rem` : "0";

  const ptRowDepth1 = isMobile ? "1.5rem" : "0.5rem";
  const ptRowDepthOver1 = isMobile ? "1rem" : "0.5rem";

  return (
    <Tr>
      {rowDepth == 1 ? (
        <Td sx={sx.parent} pl={parentPl}>
          <Text>{name}</Text>
          {isMobileAndNotChildEditButton}
        </Td>
      ) : (
        <Td sx={sx.subparent} pl={subparentPl}>
          <Text>{name}</Text>
          {isMobileAndNotChildEditButton}
        </Td>
      )}
      <Td
        sx={sx.statusColumn}
        pt={rowDepth == 1 ? ptRowDepth1 : ptRowDepthOver1}
      >
        <StatusIcon
          reportType={report?.reportType as ReportType}
          status={status}
        />
      </Td>
      {!isMobile && <Td>{notChildEditButton}</Td>}
    </Tr>
  );
};

interface RowProps {
  page: ReportPageProgress;
  rowDepth: number;
}

const sx = {
  parent: {
    fontWeight: "bold",
    lineHeight: "1.125rem",
    fontSize: "sm",
    paddingTop: "1rem",
    paddingBottom: "1rem",
    ".mobile &": {
      paddingTop: "1.5rem",
      paddingBottom: "1.5rem",
    },
  },
  subparent: {
    paddingTop: "1rem",
    paddingBottom: "1rem",
    lineHeight: "1.125rem",
    fontSize: "sm",
  },
  statusColumn: {
    ".mobile &": {
      display: "flex",
      borderTop: 0,
      paddingLeft: 0,
    },
  },
};
