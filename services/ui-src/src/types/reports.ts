import { CustomHtmlElement, FormJson } from "types";

export interface ReportPageVerbiage {
  intro: {
    section: string;
    subsection?: string;
    spreadsheet?: string;
    info?: string | CustomHtmlElement[];
    exportSectionHeader?: string;
  };
}

export interface ReportRouteBase {
  name: string;
  path: string;
  pageType?: string;
}

export interface ReportPageShapeBase extends ReportRouteBase {
  children?: never;
  verbiage: ReportPageVerbiage;
}

export interface StandardReportPageShape extends ReportPageShapeBase {
  form: FormJson;
  dashboard?: never;
  modalForm?: never;
  drawerForm?: never;
  entityType?: never;
}
