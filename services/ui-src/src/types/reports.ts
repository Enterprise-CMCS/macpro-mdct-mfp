import {
  AnyObject,
  Choice,
  CustomHtmlElement,
  EntityShape,
  FormJson,
} from "types";

// REPORT TYPES
export enum ReportType {
  WP = "WP",
  SAR = "SAR",
}

// REPORT STRUCTURE
export interface ReportPageVerbiage {
  intro: {
    section: string;
    subsection?: string;
    info?: string | CustomHtmlElement[];
    spreadsheet?: string;
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

export interface DrawerReportPageShape extends ReportPageShapeBase {
  entityType: string;
  verbiage: DrawerReportPageVerbiage;
  drawerForm: FormJson;
  modalForm?: never;
  form?: never;
}

export interface ModalDrawerReportPageShape extends ReportPageShapeBase {
  entityType: string;
  entityInfo?: string[];
  verbiage: ModalDrawerReportPageVerbiage;
  modalForm: FormJson;
  drawerForm: FormJson;
  form?: never;
}

export interface OverlayModalPageShape extends ReportPageShapeBase {
  entityType: string;
  verbiage: OverlayModalPageVerbiage;
  modalForm: FormJson;
  form?: never;
}

export interface ModalOverlayReportPageShape extends ReportPageShapeBase {
  entityType: string;
  entityInfo?: string[];
  verbiage: ModalOverlayReportPageVerbiage;
  modalForm: FormJson;
  overlayForm?: FormJson;
  drawerForm?: never;
  form?: never;
  dashboard?: FormJson;
}

export interface EntityDetailsOverlayShape extends ReportPageShapeBase {
  verbiage: EntityOverlayPageVerbiage;
  form: FormJson;
}

export interface EntityDetailsDashboardOverlayShape
  extends ReportPageShapeBase {
  dashboard?: FormJson;
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

export type ReportRouteWithForm =
  | StandardReportPageShape
  | DrawerReportPageShape
  | ModalDrawerReportPageShape
  | ModalOverlayReportPageShape
  | EntityDetailsOverlayShape
  | OverlayModalPageShape
  | EntityDetailsDashboardOverlayShape;

export interface ReportRouteWithoutForm extends ReportRouteBase {
  children?: ReportRoute[];
  pageType?: string;
  entityType?: never;
  verbiage?: never;
  modalForm?: never;
  drawerForm?: never;
  form?: never;
}

export interface DrawerReportPageVerbiage extends ReportPageVerbiage {
  dashboardTitle: string;
  drawerTitle: string;
  drawerInfo?: CustomHtmlElement[];
  missingEntityMessage?: CustomHtmlElement[];
}

export interface ModalDrawerReportPageVerbiage
  extends DrawerReportPageVerbiage {
  addEntityButtonText: string;
  editEntityButtonText: string;
  addEditModalAddTitle: string;
  addEditModalEditTitle: string;
  deleteEntityButtonAltText: string;
  deleteModalTitle: string;
  deleteModalConfirmButtonText: string;
  deleteModalWarning: string;
  entityUnfinishedMessage: string;
  enterEntityDetailsButtonText: string;
  reviewPdfHint: string;
  drawerTitle: string;
}

export interface OverlayModalPageVerbiage extends ReportPageVerbiage {
  addEntityButtonText: string;
  addEditModalHint: string;
  editEntityButtonText: string;
  addEditModalAddTitle: string;
  addEditModalEditTitle: string;
  deleteEntityButtonAltText: string;
  deleteModalTitle: string;
  deleteModalConfirmButtonText: string;
  deleteModalWarning: string;
  entityUnfinishedMessage: string;
  enterEntityDetailsButtonText: string;
  accordion: object;
  dashboardTitle: string;
  missingEntityMessage?: CustomHtmlElement[];
}

export interface ModalOverlayReportPageVerbiage extends ReportPageVerbiage {
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

/**
 * Shape of autosave field input. Since autosave is atomic, it requires a special shape
 * to more easily validate field values.
 */
export interface AutosaveField {
  name: string;
  type: string;
  value: FieldValue;
  defaultValue?: FieldValue;
  hydrationValue?: FieldValue;
  overrideCheck?: boolean;
}

/**
 * Type for a selection radio or checklist option.
 */
export interface SelectedOption {
  label: string;
  value: string;
}

/**
 * All (most) of the possible field value types.
 */
export type FieldValue =
  | string
  | number
  | EntityShape
  | EntityShape[]
  | Choice
  | Choice[]
  | SelectedOption;
