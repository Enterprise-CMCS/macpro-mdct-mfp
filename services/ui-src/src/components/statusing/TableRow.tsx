import { Td, Text, Tr } from "@chakra-ui/react";
import { ReportPageProgress } from "types";
import { useBreakpoint, useStore } from "utils";
import { EditButton } from "./EditButton";
import { StatusIcon } from "./StatusIcon";

export const TableRow = ({ page, rowDepth }: RowProps) => {
  const { isMobile } = useBreakpoint();
  const { name, path, children, status } = page;
  const { editable } = useStore();
  const buttonAriaLabel = editable ? `Edit  ${name}` : `View  ${name}`;

  const isMobileAndNotChildEditButton =
    isMobile && !children && EditButton({ buttonAriaLabel, path, editable });

  const notChildEditButton =
    !children &&
    EditButton({ buttonAriaLabel, path, editable, showIcon: true });

  let parentPl = "1rem";
  let subparentPl = `${1.25 * rowDepth}rem`;
  let ptRowDepth1 = "0.5rem";
  let ptRowDepthOver1 = "0.5rem";

  if (isMobile) {
    parentPl = "0";
    subparentPl = "0";
    ptRowDepth1 = "1.5rem";
    ptRowDepthOver1 = "1rem";
  }

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
        <StatusIcon status={status} />
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
