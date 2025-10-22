// types
import { ReportJsonFile, ReportType } from "../../../utils/types";

export const ReportJson: ReportJsonFile = {
  type: ReportType.ABCD,
  name: "MFP ABCD Report",
  basePath: "/abcd",
  version: "ABCD_2025-07-10",
  entities: {
    "": { required: true },
  },
  routes: [],
};
