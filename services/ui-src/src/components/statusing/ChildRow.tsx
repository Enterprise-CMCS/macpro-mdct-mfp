import { Fragment } from "react";
import { ReportPageProgress } from "types";
import { TableRow } from "./TableRow";

export const ChildRow = ({ page, rowDepth }: RowProps) => {
  const { name, children } = page;

  return (
    <Fragment key={name}>
      <TableRow page={page} rowDepth={rowDepth} />
      {children?.map((child) => (
        <ChildRow key={child.path} page={child} rowDepth={rowDepth + 1} />
      ))}
    </Fragment>
  );
};

interface RowProps {
  page: ReportPageProgress;
  rowDepth: number;
}
