import { SystemStyleObject } from "@chakra-ui/react";
import React from "react";

// ALERTS

export enum AlertTypes {
  ERROR = "error",
  WARNING = "warn",
}

// TIME

export interface DateShape {
  year: number;
  month: number;
  day: number;
}

export interface TimeShape {
  hour: number;
  minute: number;
  second: number;
}

// OTHER
export interface AnyObject {
  [key: string]: any;
}

export enum OverlayModalTypes {
  INITIATIVE = "initiative",
}

export enum EntityDetailsStepTypes {
  DEFINE_INITIATIVE = "defineInitiative",
  CLOSE_OUT_INFORMATION = "closeOutInformation",
  INITIAVTIVE_PROGRESS = "initiativeProgress",
  EXPENDITURES = "expenditures",
}

export enum OverlayModalStepTypes {
  EVALUATION_PLAN = "evaluationPlan",
  FUNDING_SOURCES = "fundingSources",
  OBJECTIVE_PROGRESS = "objectiveProgress",
}

export enum EntityDetailsOverlayTypes {
  CLOSEOUT_INFORMATION = "closeOutInformation",
}

export enum ModalDrawerEntityTypes {
  TARGET_POPULATIONS = "targetPopulations",
}

export enum PageTypes {
  STANDARD = "standard",
  DRAWER = "drawer",
  MODAL_DRAWER = "modalDrawer",
  MODAL_OVERLAY = "modalOverlay",
  DYNAMIC_MODAL_OVERLAY = "dynamicModalOverlay",
  ENTITY_OVERLAY = "entityOverlay",
  OVERLAY_MODAL = "overlayModal",
  REVIEW_SUBMIT = "reviewSubmit",
}

export enum EntityStatuses {
  COMPLETE = "complete",
  CLOSE = "close",
  DISABLED = "disabled",
  INCOMPLETE = "incomplete",
  NO_STATUS = "no status",
}

export interface InputChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

export type { IconType } from "react-icons";

export interface TableContentShape {
  caption?: string;
  headRow?: string[];
  bodyRows?: string[][];
  footRow?: string[][];
}

export interface CustomHtmlElement {
  type: string;
  content?: string | any;
  as?: string;
  props?: AnyObject;
  children?: any[];
}

export interface ErrorVerbiage {
  title: string;
  description: string | CustomHtmlElement[];
}

export interface SxObject {
  [key: string]: SystemStyleObject;
}
