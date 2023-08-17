import { AnyObject, CustomHtmlElement, FormJson } from "types";

// REPORT TYPES
export enum ReportType {
  MFP = "MFP",
  WP = "WP",
  SAR = "SAR",
}

// REPORT STRUCTURE
export interface ReportPageVerbiage {
  intro: {
    section: string;
    subsection?: string;
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

export interface ReportJson {
  id?: string;
  type?: string;
  name: string;
  basePath: string;
  routes: ReportRoute[];
  flatRoutes?: ReportRoute[];
  validationSchema?: AnyObject;
  validationJson?: AnyObject;
}

export type ReportRoute = ReportRouteWithForm | ReportRouteWithoutForm;

export type ReportRouteWithForm = StandardReportPageShape;

export interface ReportRouteWithoutForm extends ReportRouteBase {
  children?: ReportRoute[];
  pageType?: string;
  entityType?: never;
  verbiage?: never;
  modalForm?: never;
  drawerForm?: never;
  form?: never;
}
