import { PageTypes, Transformation } from "./formFields";
import { AnyObject, CustomHtmlElement } from "./other";
import { ReportType } from "./reports";
import {
  CustomValidation,
  NestedValidation,
  ValidationType,
} from "./validations";

export interface ReportJsonFile {
  basePath: string;
  entities: Record<string, { required: boolean }>;
  name: string;
  routes: (
    | FormRoute
    | PageRoute
    | ParentRoute
    | SARStateOrTerritorySpecificInitiativesRoute
    | WPStateOrTerritorySpecificInitiativesRoute
  )[];
  type: ReportType;
  version: string;
}

// Forms
export interface ReportForm {
  id: string;
  fields: ReportFormField[];
  optional?: boolean;
}

export enum ReportFormFieldType {
  CHECKBOX = "checkbox",
  DATE = "date",
  DYNAMIC = "dynamic",
  NO_TYPE = "",
  NUMBER = "number",
  RADIO = "radio",
  SECTION_HEADER = "sectionHeader",
  TEXT = "text",
  TEXTAREA = "textarea",
}

export interface ReportFormField {
  id: string;
  forTableOnly?: boolean;
  props?: ReportFormFieldProps;
  transformation?: Transformation;
  type: ReportFormFieldType;
  validation?: ValidationType | CustomValidation;
}

export interface ReportFormFieldProps {
  choices?: {
    id: string;
    label: string;
    children?: {
      id: string;
      transformation?: Transformation;
      props?: {
        className?: string;
        decimalPlacesToRoundTo?: number;
        hint?: string;
        label?: string;
      };
      type: ReportFormFieldType;
      validation?: NestedValidation;
    }[];
  }[];
  className?: string;
  content?: string;
  decimalPlacesToRoundTo?: number;
  disabled?: boolean;
  heading?: string;
  hint?: any;
  label?: string;
  mask?: string;
  maxLength?: number;
  styleAsOptional?: boolean;
  subType?: ReportFormFieldType;
}

// Form Tables
export interface ReportFormWithTables {
  id: string;
  fields: ReportFormField[];
  tables: FormTable[];
  verbiage?: {
    [key: string]: any;
  };
}

export type FormTableCell = string | ReportFormField;
export type FormTableRow = FormTableCell[];
export type FormTableRows = FormTableRow[];

export interface FormTable {
  id: string;
  bodyRows: FormTableRows;
  dynamicRows?: FormTableRows;
  footRows: FormTableRows;
  headRows: FormTableRows;
  options?: AnyObject;
  tableType: FormTableType;
  verbiage?: {
    dynamicRows?: {
      buttonText: string;
      hint: string;
      label: string;
    };
    errorMessage?: string | CustomHtmlElement[];
    percentage?: string;
    title: string;
    hint?: string | CustomHtmlElement[];
  };
}

export enum FormTableType {
  CALCULATION = "Calculation",
}

export interface ServiceField {
  id: string;
  label: string;
  readOnly?: boolean;
}

export enum ServiceFieldType {
  CATEGORY = "category",
  TOTAL_COMPUTABLE = "totalComputable",
  TOTAL_FEDERAL_SHARE = "totalFederalShare",
  OVERRIDE_PERCENTAGE = "overridePercentage",
  TOTAL_STATE_TERRITORY_SHARE = "totalStateTerritoryShare",
}

// Routes
export interface BaseRoute {
  conditionallyRender?: string;
  name: string;
  path: string;
  verbiage?: any;
}

export interface ParentRoute extends BaseRoute {
  children: (FormRoute | WPStateOrTerritorySpecificInitiativesRoute)[];
}

export interface PageRoute extends BaseRoute {
  pageType: PageTypes;
}

export interface FormRoute extends BaseRoute {
  form: ReportForm;
  pageType: PageTypes;
}

export interface FormTablesRoute extends BaseRoute {
  form: ReportFormWithTables;
  pageType: PageTypes;
}

export interface ModalRoute extends BaseRoute {
  modalForm: ReportForm;
  pageType: PageTypes;
}

// WP routes
export interface WPStateOrTerritorySpecificInitiativesRoute extends ModalRoute {
  dashboard: Dashboard;
  entityInfo: string[];
  entitySteps: WPEntityStep[];
  entityType: StepEntityType;
}

export interface WPTransitionBenchmarksRoute extends ModalRoute {
  drawerForm: ReportForm;
  entityInfo: string[];
  entityType: StepEntityType;
}

// SAR routes
export interface SARStateOrTerritorySpecificInitiativesRoute extends BaseRoute {
  entityInfo: string[];
  entityType: StepEntityType;
  initiatives: string[];
  pageType: string;
  template: {
    dashboard: Dashboard;
    entitySteps: SAREntityStep[];
  };
}

// Steps
export interface Dashboard {
  name: string;
  verbiage?: any;
}

export enum StepEntityType {
  INITIATIVE = "initiative",
  TARGET_POPULATIONS = "targetPopulations",
}

export enum StepType {
  CLOSE_OUT_INFORMATION = "closeOutInformation",
  DEFINE_INITIATIVE = "defineInitiative",
  EVALUATION_PLAN = "evaluationPlan",
  EXPENDITURES = "expenditures",
  FUNDING_SOURCES = "fundingSources",
  INITIATIVE_PROGRESS = "initiativeProgress",
  OBJECTIVE_PROGRESS = "objectiveProgress",
  TARGET_POPULATIONS = "targetPopulations",
}

export interface EntityStep {
  entityType: StepEntityType;
  form?: ReportForm;
  hint: string;
  isRequired: boolean;
  name: string;
  pageType: PageTypes;
  stepInfo: string[];
  stepType: StepType;
  transformation?: Transformation;
  verbiage: any;
}

export interface WPEntityStep extends EntityStep {
  path: string;
  modalForm?: ReportForm;
  stepName: string;
}

export interface SAREntityStep extends EntityStep {
  objectiveCardTemplate?: {
    modalForm: ReportForm;
  };
}
