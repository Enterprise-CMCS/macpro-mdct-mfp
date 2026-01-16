// GLOBAL

export interface AnyObject {
  [key: string]: any;
}

export interface CompletionData {
  [key: string]: boolean | CompletionData;
}

/**
 * Abridged copy of the type used by `aws-lambda@1.0.7` (from `@types/aws-lambda@8.10.88`)
 * We only this package for these types, and we use only a subset of the
 * properties. Since `aws-lambda` depends on `aws-sdk` (that is, SDK v2),
 * we can save ourselves a big dependency with this small redundancy.
 */

export interface APIGatewayProxyEventPathParameters {
  [name: string]: string | undefined;
}

export interface APIGatewayProxyEvent {
  body: string | null;
  headers: Record<string, string | undefined>;
  multiValueHeaders: Record<string, string | undefined>;
  httpMethod: string;
  isBase64Encoded: boolean;
  path: string;
  pathParameters: Record<string, string | undefined> | null;
  queryStringParameters: Record<string, string | undefined> | null;
  multiValueQueryStringParameters: Record<string, string | undefined> | null;
  stageVariables: Record<string, string | undefined> | null;
  /** The context is complicated, and we don't (as of 2023) use it at all. */
  requestContext: any;
  resource: string;
}

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

export interface CustomHtmlElement {
  type: string;
  content: string | any;
  as?: string;
  props?: AnyObject;
}

export interface ErrorVerbiage {
  title: string;
  description: string | CustomHtmlElement[];
}

const states = [
  "AL",
  "AK",
  "AS", // American Samoa
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "DC",
  "FL",
  "FM", // Federated States of Micronesia
  "GA",
  "GU", // Guam
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MH", // Marshall Islands
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MP", // Northern Mariana Islands
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "PR",
  "PW", // Palau
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "VI", // Virgin Islands
  "WA",
  "WV",
  "WI",
  "WY",
] as const;
export type State = (typeof states)[number];

export const isState = (state: unknown): state is State => {
  return states.includes(state as State);
};

export interface FormTemplateVersion {
  md5Hash: string;
  versionNumber: number;
  id: string;
  lastAltered: string;
  reportType: string;
}

export const enum TemplateKeys {
  WP = "templates/MFP-Work-Plan-Help-File.pdf",
  SAR = "templates/MFP-Semi-Annual-Rprt-Help-File.pdf",
}

/**
 * S3Create event
 * https://docs.aws.amazon.com/AmazonS3/latest/dev/notification-content-structure.html
 */

export interface S3EventRecordGlacierRestoreEventData {
  lifecycleRestorationExpiryTime: string;
  lifecycleRestoreStorageClass: string;
}
export interface S3EventRecordGlacierEventData {
  restoreEventData: S3EventRecordGlacierRestoreEventData;
}

export interface S3EventRecord {
  eventVersion: string;
  eventSource: string;
  awsRegion: string;
  eventTime: string;
  eventName: string;
  userIdentity: {
    principalId: string;
  };
  requestParameters: {
    sourceIPAddress: string;
  };
  responseElements: {
    "x-amz-request-id": string;
    "x-amz-id-2": string;
  };
  s3: {
    s3SchemaVersion: string;
    configurationId: string;
    bucket: {
      name: string;
      ownerIdentity: {
        principalId: string;
      };
      arn: string;
    };
    object: {
      key: string;
      size: number;
      eTag: string;
      versionId?: string | undefined;
      sequencer: string;
    };
  };
  glacierEventData?: S3EventRecordGlacierEventData | undefined;
}

/**
 * Use this type to create a type guard for filtering arrays of objects
 * by the presence of certain attributes.
 *
 * @example
 * interface Foo {
 *    bar: string;
 *    baz?: string;
 *    buzz?: string;
 *    bizz?: string;
 * }
 * type RequireBaz = SomeRequired<Foo, 'baz'>
 * const array: Foo[] = [
 *  { bar: 'always here' },
 *  { bar: 'always here', baz: 'sometimes here' }
 * ]
 * array.filter((f): f is RequireBaz => typeof f.baz !== 'undefined' )
 * // `array`'s type now shows bar and baz as required.
 * array.map((f) => return f.baz)
 */
export type SomeRequired<T, K extends keyof T> = Required<Pick<T, K>> &
  Omit<T, K>;

/**
 * Instructs Typescript to complain if it detects that this function may be reachable.
 * Useful for the default branch of a switch statement that verifiably covers every case.
 */
export const assertExhaustive = (_: never): void => {};
