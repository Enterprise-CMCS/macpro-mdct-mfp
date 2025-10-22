import { PageTypes } from "./formFields";
import { ReportType } from "./reports";

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
export interface ReportFormField {
  id: string;
  props?: any;
  type: string;
  transformation?: {
    rule: string;
  };
  validation?: string;
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
  entityType: EntityTypes;
}

export interface WPTransitionBenchmarksRoute extends ModalRoute {
  drawerForm: ReportForm;
  entityInfo: string[];
  entityType: EntityTypes;
}

// SAR routes
export interface SARStateOrTerritorySpecificInitiativesRoute extends BaseRoute {
  entityInfo: string[];
  entityType: EntityTypes;
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

export enum EntityTypes {
  INITIATIVE = "initiative",
  TARGET_POPULATIONS = "targetPopulations",
}

export enum StepTypes {
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
  entityType: EntityTypes;
  form?: ReportForm;
  hint: string;
  isRequired: boolean;
  name: string;
  pageType: PageTypes;
  stepInfo: string[];
  stepType: StepTypes;
  transformation?: {
    rule: string;
  };
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
