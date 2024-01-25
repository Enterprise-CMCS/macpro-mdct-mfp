import {
  AnyObject,
  FormJson,
  ReportPageShapeBase,
  TableContentShape,
} from "types";

// components
import { Box } from "@chakra-ui/react";
import { Table } from "components";

// utils
import { useStore, sumOfRow, sumOfTwoRows, perOfTwoRows } from "utils";
import { notAnsweredText } from "../../constants";

export const ExportExpendituresTable = ({ section }: Props) => {
    console.log("table");
};

export interface Props {
    section: ReportPageShapeBase;
  }
  