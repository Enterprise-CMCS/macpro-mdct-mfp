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
  type: string;
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
  pageType: string;
}

export interface FormRoute extends BaseRoute {
  form: ReportForm;
  pageType: string;
}

export interface ModalRoute extends BaseRoute {
  modalForm: ReportForm;
  pageType: string;
}

// WP routes
export interface WPStateOrTerritorySpecificInitiativesRoute extends ModalRoute {
  dashboard: Dashboard;
  entityInfo: string[];
  entitySteps: WPEntityStep[];
  entityType: string;
}

export interface WPTransitionBenchmarksRoute extends ModalRoute {
  drawerForm: ReportForm;
  entityInfo: string[];
  entityType: string;
}

// SAR routes
export interface SARStateOrTerritorySpecificInitiativesRoute extends BaseRoute {
  entityInfo: string[];
  entityType: string;
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

export interface EntityStep {
  entityType: string;
  form?: ReportForm;
  hint: string;
  isRequired: boolean;
  name: string;
  pageType: string;
  stepInfo: string[];
  stepType: string;
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
