import { ReportFieldData, ReportMetadataShape } from "../utils/types";

export type AwsHeaders = {
  "Content-Type"?: string;
  "X-Amz-Target"?: string;
  "x-api-key"?: string;
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
