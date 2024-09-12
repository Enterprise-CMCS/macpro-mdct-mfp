import {
  ReportFieldData,
  ReportMetadataShape,
} from "../../services/app-api/utils/types";

export type AwsHeaders = {
  authorization?: string;
  host?: string;
  "Content-Type"?: string;
  "X-Amz-Target"?: string;
  "x-api-key"?: string;
  "x-amz-date"?: string;
  "x-amz-security-token"?: string;
};

export type SeedReportMetadataShape = Omit<
  ReportMetadataShape,
  | "fieldDataId"
  | "formTemplateId"
  | "createdAt"
  | "lastAltered"
  | "dueDate"
  | "state"
  | "id"
>;
export type SeedFillReportMetadataShape = Omit<
  SeedReportMetadataShape,
  "submissionName" | "reportPeriod" | "reportYear" | "reportType"
>;

export type SeedNewReportShape = {
  metadata: SeedReportMetadataShape;
  fieldData: ReportFieldData;
};

export type SeedFillReportShape = {
  metadata: SeedFillReportMetadataShape;
  fieldData: ReportFieldData;
};

export type SeedReportShape = ReportMetadataShape & {
  fieldData: ReportFieldData;
};

export type SeedBannerDataShape = {
  key: string;
  title: string;
  description: string;
  startDate: number;
  endDate: number;
};

export type SeedBannerShape = {
  Item?: SeedBannerDataShape;
  Key?: SeedBannerDataShape;
};
