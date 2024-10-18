import { Td, Text, Tr } from "@chakra-ui/react";
import { ReportPageProgress } from "types";
import { useBreakpoint, useStore } from "utils";
import { EditButton } from "./EditButton";
import { StatusIcon } from "./StatusIcon";

export const TableRow = ({ page, rowDepth }: RowProps) => {
  const { isMobile } = useBreakpoint();
  const { editable } = useStore();
  const { name, path, children, status } = page;
  const buttonAriaLabel = editable ? `Edit  ${name}` : `View  ${name}`;

  const displayMobileEditButton = isMobile && !children?.length;
  const displayDefaultEditButton = !isMobile && !children?.length;

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
      <Td
        sx={rowDepth == 1 ? sx.parent : sx.subparent}
        pl={rowDepth == 1 ? parentPl : subparentPl}
      >
        <Text>{name}</Text>
        {displayMobileEditButton && (
          <EditButton
            buttonAriaLabel={buttonAriaLabel}
            path={path}
            editable={editable}
          />
        )}
      </Td>
      <Td
        sx={sx.statusColumn}
        pt={rowDepth == 1 ? ptRowDepth1 : ptRowDepthOver1}
      >
        <StatusIcon status={status} />
      </Td>
      {displayDefaultEditButton && (
        <Td>
          <EditButton
            buttonAriaLabel={buttonAriaLabel}
            path={path}
            editable={editable}
            showIcon={true}
          />
        </Td>
      )}
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
