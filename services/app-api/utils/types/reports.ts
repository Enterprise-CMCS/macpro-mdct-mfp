import { FormJson } from "./formFields";
import { AnyObject, CustomHtmlElement } from "./other";

// REPORT STRUCTURE

export interface ReportJson {
  id?: string;
  type: ReportType;
  name: string;
  basePath: string;
  routes: ReportRoute[];
  validationSchema?: AnyObject;
  /**
   * The validationJson property is populated at the moment any form template
   * is stored in S3 for the first time. It will be populated from that moment on.
   */
  validationJson?: AnyObject;
}

export type ReportRoute = ReportRouteWithForm | ReportRouteWithoutForm;

export interface ReportRouteBase {
  name: string;
  path: string;
  pageType?: string;
  conditionallyRender?: string;
}

export type ReportRouteWithForm =
  | StandardReportPageShape
  | DrawerReportPageShape
  | ModalDrawerReportPageShape
  | ModalOverlayReportPageShape
  | OverlayModalPageShape
  | EntityDetailsOverlayShape
  | DynamicModalOverlayReportPageShape;

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
  entitySteps?: never;
  template?: never;
  initiatives?: never;
  objectiveCards?: never;
}

export interface DrawerReportPageShape extends ReportPageShapeBase {
  entityType: string;
  verbiage: DrawerReportPageVerbiage;
  drawerForm: FormJson;
  modalForm?: never;
  form?: never;
  entitySteps?: never;
  dashboard?: never;
  template?: never;
  initiatives?: never;
  objectiveCards?: never;
}

export interface ModalDrawerReportPageShape extends ReportPageShapeBase {
  entityType: string;
  verbiage: ModalDrawerReportPageVerbiage;
  modalForm: FormJson;
  drawerForm: FormJson;
  form?: never;
  entitySteps?: never;
  dashboard?: never;
  template?: never;
  initiatives?: never;
  objectiveCards?: never;
}

export interface ModalOverlayReportPageShape extends ReportPageShapeBase {
  initiativeId: string | undefined;
  entityType: string;
  entityInfo?: string[];
  verbiage: ModalOverlayReportPageVerbiage;
  modalForm: FormJson;
  drawerForm?: never;
  form?: never;
  dashboard: EntityDetailsDashboardOverlayShape;
  entitySteps?: (EntityDetailsOverlayShape | OverlayModalPageShape)[];
  template?: never;
  initiatives?: never;
  objectiveCards?: never;
}

export interface DynamicModalOverlayReportPageShape extends ReportPageShapeBase {
  entityType: string;
  entityInfo: string[];
  verbiage: ModalOverlayReportPageVerbiage;
  drawerForm?: never;
  modalForm?: never;
  form?: never;
  entitySteps?: never;
  dashboard?: never;
  initiatives: {
    initiativeId: string;
    name: string;
    topic: string;
    dashboard: FormJson;
    entitySteps: (EntityDetailsOverlayShape | OverlayModalPageShape)[];
  }[];
  objectiveCards?: never;
  /** Only used during form template transformation; will be absent after transformation */
  template?: AnyObject;
}

export interface OverlayModalPageShape extends ReportPageShapeBase {
  entityType: string;
  stepName: string;
  hint: string;
  verbiage: ModalOverlayReportPageVerbiage;
  modalForm: FormJson;
  drawerForm?: FormJson;
  form?: never;
  entitySteps?: never;
  dashboard?: never;
  template?: never;
  initiatives?: never;
  objectiveCards?: {
    modalForm?: FormJson;
  }[];
}

export interface EntityDetailsOverlayShape extends ReportPageShapeBase {
  stepName: string;
  hint: string;
  form: FormJson;
  verbiage: EntityOverlayPageVerbiage;
  entityType?: never;
  dashboard?: never;
  modalForm?: never;
  drawerForm?: never;
  entitySteps?: never;
  template?: never;
  initiatives?: never;
  objectiveCards?: {
    modalForm?: FormJson;
  }[];
}

export interface EntityDetailsDashboardOverlayShape extends ReportPageShapeBase {
  dashboard?: never;
  template?: never;
  initiatives?: never;
  objectiveCards?: never;
}

export interface ReportRouteWithoutForm extends ReportRouteBase {
  children?: ReportRoute[];
  pageType?: string;
  entityType?: never;
  verbiage?: never;
  modalForm?: never;
  drawerForm?: never;
  form?: never;
  entitySteps?: never;
  dashboard?: never;
  template?: never;
  initiatives?: never;
  objectiveCards?: never;
}

export interface ReportPageVerbiage {
  intro: {
    section: string;
    subsection?: string;
    hint?: string;
    info?: string | CustomHtmlElement[];
  };
  closeOutWarning?: AnyObject;
  closeOutModal?: AnyObject;
}

export interface DrawerReportPageVerbiage extends ReportPageVerbiage {
  dashboardTitle: string;
  countEntitiesInTitle?: boolean;
  drawerTitle: string;
  drawerInfo?: CustomHtmlElement[];
  missingEntityMessage?: CustomHtmlElement[];
}

export interface ModalDrawerReportPageVerbiage extends DrawerReportPageVerbiage {
  addEntityButtonText: string;
  editEntityButtonText: string;
  readOnlyEntityButtonText: string;
  addEditModalAddTitle: string;
  addEditModalEditTitle: string;
  addEditModalMessage: string;
  deleteEntityButtonAltText: string;
  deleteModalTitle: string;
  deleteModalConfirmButtonText: string;
  deleteModalWarning: string;
  entityUnfinishedMessage: string;
  enterEntityDetailsButtonText: string;
  readOnlyEntityDetailsButtonText: string;
  editEntityDetailsButtonText: string;
}

export interface ModalOverlayReportPageVerbiage extends EntityOverlayPageVerbiage {
  addEntityButtonText: string;
  dashboardTitle: string;
  countEntitiesInTitle: boolean;
  tableHeader: string;
  addEditModalHint: string;
  emptyDashboardText: string;
}

export interface EntityOverlayPageVerbiage extends ReportPageVerbiage {
  closeOutWarning?: {
    title?: string;
    description?: string;
  };
  closeOutModal?: {
    closeOutModalButtonText?: string;
    closeOutModalTitle?: string;
    closeOutModalBodyText?: string;
    closeOutModalConfirmButtonText?: string;
  };
}

export enum ReportType {
  WP = "WP",
  SAR = "SAR",
  EXPENDITURE = "EXPENDITURE",
}
/**
 * Check if unknown value is a report type
 *
 * @param reportType possible report type value
 * @returns type assertion for value
 */
export function isReportType(reportType: unknown): reportType is ReportType {
  return Object.values(ReportType).includes(reportType as ReportType);
}
