import { PageTypes, Transformation } from "./formFields";
import { ReportType } from "./reports";
import {
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
  props?: ReportFormFieldProps;
  type: ReportFormFieldType;
  transformation?: Transformation;
  validation?: ValidationType;
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
