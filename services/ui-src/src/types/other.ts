import React from "react";

// ALERTS

export enum AlertTypes {
  ERROR = "error",
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
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

export enum OverlayModalEntityTypes {
  EVALUATION_PLAN = "evaluationPlan",
  FUNDING_SOURCES = "fundingSources",
}

export enum ModalDrawerEntityTypes {
  TARGET_POPULATIONS = "targetPopulations",
}

export enum PageTypes {
  STANDARD = "standard",
  DRAWER = "drawer",
  MODAL_DRAWER = "modalDrawer",
  MODAL_OVERLAY = "modalOverlay",
  ENTITY_OVERLAY = "entityOverlay",
  OVERLAY_MODAL = "overlayModal",
  REVIEW_SUBMIT = "reviewSubmit",
}

export interface InputChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

export type { IconType } from "react-icons";

export interface TableContentShape {
  caption?: string;
  headRow?: string[];
  bodyRows?: string[][];
}

export interface CustomHtmlElement {
  type: string;
  content: string | any;
  as?: string;
  props?: AnyObject;
  children?: CustomHtmlElement[];
}
