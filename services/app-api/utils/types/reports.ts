import { FormJson } from "./formFields";
import { AnyObject, CompletionData, CustomHtmlElement, State } from "./other";

// REPORT STRUCTURE

export interface ReportJson {
  id?: string;
  type?: string;
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
  overlayForm?: never;
  drawerForm?: never;
  entityType?: never;
  entitySteps?: never;
  initiatives?: never;
}

export interface DrawerReportPageShape extends ReportPageShapeBase {
  entityType: string;
  verbiage: DrawerReportPageVerbiage;
  drawerForm: FormJson;
  modalForm?: never;
  overlayForm?: never;
  form?: never;
  entitySteps?: never;
  dashboard?: never;
  initiatives?: never;
}

export interface ModalDrawerReportPageShape extends ReportPageShapeBase {
  entityType: string;
  verbiage: ModalDrawerReportPageVerbiage;
  modalForm: FormJson;
  drawerForm: FormJson;
  overlayForm?: never;
  form?: never;
  entitySteps?: never;
  dashboard?: never;
  initiatives?: never;
}

export interface ModalOverlayReportPageShape extends ReportPageShapeBase {
  entityType: string;
  entityInfo?: string[];
  verbiage: ModalOverlayReportPageVerbiage;
  modalForm: FormJson;
  overlayForm?: FormJson;
  drawerForm?: never;
  form?: never;
  dashboard: EntityDetailsDashboardOverlayShape;
  entitySteps?: (EntityDetailsOverlayShape | OverlayModalPageShape)[];
  initiatives?: never;
}

export interface DynamicModalOverlayReportPageShape
  extends ReportPageShapeBase {
  entityType: string;
  entityInfo?: string[];
  verbiage: ModalOverlayReportPageVerbiage;
  initiatives?: any[];
  template: AnyObject;
  drawerForm?: never;
  modalForm?: never;
  overlayForm?: never;
  form?: never;
  entitySteps?: never;
  dashboard?: never;
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
  initiatives?: never;
}

export interface EntityDetailsOverlayShape extends ReportPageShapeBase {
  stepName: string;
  hint: string;
  form: FormJson;
  verbiage: EntityOverlayPageVerbiage;
  entityType?: never;
  dashboard?: never;
  modalForm: never;
  drawerForm?: never;
  entitySteps?: never;
  initiatives?: never;
}

export interface EntityDetailsDashboardOverlayShape
  extends ReportPageShapeBase {
  dashboard?: never;
  entitySteps: (EntityDetailsOverlayShape | OverlayModalPageShape)[];
}

export interface ReportRouteWithoutForm extends ReportRouteBase {
  children?: ReportRoute[];
  pageType?: string;
  entityType?: never;
  verbiage?: never;
  modalForm?: never;
  overlayForm?: never;
  drawerForm?: never;
  form?: never;
  entitySteps?: never;
  dashboard?: never;
  initiatives?: never;
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

export interface ModalDrawerReportPageVerbiage
  extends DrawerReportPageVerbiage {
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

export interface ModalOverlayReportPageVerbiage
  extends EntityOverlayPageVerbiage {
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

// REPORT METADATA

export interface ReportMetadata {
  submissionName: string;
  archived: boolean;
  reportType: string;
  submittedBy?: string;
  createdAt: number;
  lastAltered: number;
  state: State;
  id: string;
  submittedOnDate?: string;
  fieldDataId: string;
  formTemplateId: string;
  lastAlteredBy: string;
  status: string;
  isComplete: boolean;
  completionStatus?: CompletionData;
  reportPeriod: number;
  reportYear: number;
  dueDate: string;
}

export interface WPReportMetadata extends ReportMetadata {
  locked: boolean;
  submissionCount: number;
  previousRevisions: string[];
}

export enum ReportType {
  WP = "WP",
  SAR = "SAR",
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
