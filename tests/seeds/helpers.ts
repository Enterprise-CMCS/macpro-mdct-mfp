/* eslint-disable no-console */
import {
  SRPClient,
  calculateSignature,
  getNowString,
} from "amazon-user-pool-srp-client";
import * as dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import { ReportFieldData } from "../../services/app-api/utils/types";
import { AwsHeaders } from "./types";
import crypto, { BinaryLike } from "crypto";

dotenv.config({ path: "../../.env" });

const apiUrl: string | undefined = process.env.API_URL;
const clientId: string | undefined = process.env.COGNITO_USER_POOL_CLIENT_ID;
const region: string =
  process.env.COGNITO_USER_POOL_ID?.split("_")[0] ||
  process.env.COGNITO_REGION ||
  "";
const userPoolId: string | undefined =
  process.env.COGNITO_USER_POOL_ID?.split("_")[1] ||
  process.env.COGNITO_USER_ID;
const cognitoUrl: string = `https://cognito-idp.${region}.amazonaws.com`;
const accessKey: string | undefined = process.env.AWS_ACCESS_KEY_ID;
const secretKey: string | undefined = process.env.AWS_SECRET_ACCESS_KEY;
const sessionToken: string | undefined = process.env.AWS_SESSION_TOKEN;

export const awsSignedHeaders = (
  method: string,
  endpoint: string,
  payload?: any
): AwsHeaders | undefined => {
  if (!accessKey || !secretKey || !sessionToken) {
    return;
  }

  // Request parameters
  const host = new URL(apiUrl || "").hostname;

  // Create a datetime object for signing
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  const hours = String(now.getUTCHours()).padStart(2, "0");
  const minutes = String(now.getUTCMinutes()).padStart(2, "0");
  const seconds = String(now.getUTCSeconds()).padStart(2, "0");
  const amzDate = `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
  const dateStamp = amzDate.slice(0, 8);

  // Create the canonical request
  const canonicalUri = endpoint;
  const canonicalQuerystring = "";
  const canonicalHeaders = `host:${host}`;
  const payloadHash = payload
    ? crypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex")
    : "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"; // pragma: allowlist secret
  const canonicalRequest = `${method}
${canonicalUri}
${canonicalQuerystring}
${canonicalHeaders}
host;x-amz-date;x-amz-security-token;x-api-key
${payloadHash}`;

  // Create the string to sign
  const credentialScope = `${dateStamp}/${region}/execute-api/aws4_request`;
  const hashCanonicalRequest = crypto
    .createHash("sha256")
    .update(canonicalRequest)
    .digest("hex");
  const stringToSign = `AWS4-HMAC-SHA256
${amzDate}
${credentialScope}
${hashCanonicalRequest}`;

  // Sign the string
  const getSignatureKey = (
    key: string,
    dateStamp: BinaryLike,
    regionName: BinaryLike
  ) => {
    const kDate = crypto
      .createHmac("SHA256", `AWS4${key}`)
      .update(dateStamp)
      .digest();
    const kRegion = crypto
      .createHmac("SHA256", kDate)
      .update(regionName)
      .digest();
    const kService = crypto
      .createHmac("SHA256", kRegion)
      .update("execute-api")
      .digest();
    const kSigning = crypto
      .createHmac("SHA256", kService)
      .update("aws4_request")
      .digest();
    return kSigning;
  };
  const signingKey = getSignatureKey(secretKey, dateStamp, region);
  const signature = crypto
    .createHmac("sha256", signingKey)
    .update(stringToSign)
    .digest("hex");

  // Add signing information to the request
  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=host;x-amz-date;x-amz-security-token;x-api-key, Signature=${signature}`;

  return {
    authorization,
    host,
    "x-amz-date": amzDate,
    "x-amz-security-token": sessionToken,
  };
};

const errorResponse = (error: any): void => {
  if (error?.cause?.code === "ECONNREFUSED") {
    console.error("‼️ API server must be running to use this script");
  } else {
    console.error(error);
  }
};

const get = async (
  url: string,
  headers: Headers | AwsHeaders
): Promise<any> => {
  const request = {
    method: "GET",
    headers,
  };

  try {
    const response = await fetch(url, request);
    return response.json();
  } catch (error) {
    errorResponse(error);
  }
};

export const getApi = async (
  url: string,
  headers: Headers | AwsHeaders
): Promise<any> => {
  return get(`${apiUrl}${url}`, headers);
};

const post = async (
  url: string,
  headers: Headers | AwsHeaders,
  body: any
): Promise<any> => {
  const request = {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(url, request);
    return response.json();
  } catch (error) {
    errorResponse(error);
  }
};

export const postApi = async (
  url: string,
  headers: Headers | AwsHeaders,
  body: any
): Promise<any> => {
  return post(`${apiUrl}${url}`, headers, body);
};

const put = async (
  url: string,
  headers: Headers | AwsHeaders,
  body: any
): Promise<any> => {
  const request = {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(url, request);
    return response.json();
  } catch (error) {
    errorResponse(error);
  }
};

export const putApi = async (
  url: string,
  headers: Headers | AwsHeaders,
  body: any
): Promise<any> => {
  return put(`${apiUrl}${url}`, headers, body);
};

const del = async (
  url: string,
  headers: Headers | AwsHeaders
): Promise<any> => {
  const request = {
    method: "delete",
    headers,
  };

  try {
    const response = await fetch(url, request);
    return response.json();
  } catch (error) {
    errorResponse(error);
  }
};

export const deleteApi = async (
  url: string,
  headers: Headers | AwsHeaders
): Promise<any> => {
  return del(`${apiUrl}${url}`, headers);
};

export const login = async (
  email: string | undefined,
  password: string | undefined
): Promise<any> => {
  const srp = new SRPClient(userPoolId);
  const SRP_A = srp.calculateA();

  return post(
    cognitoUrl,
    {
      "Content-Type": "application/x-amz-json-1.1",
      "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
    },
    {
      ClientId: clientId,
      AuthFlow: "USER_SRP_AUTH",
      AuthParameters: {
        USERNAME: email,
        SRP_A,
      },
    }
  ).then(async ({ ChallengeName, ChallengeParameters }) => {
    const hkdf = srp.getPasswordAuthenticationKey(
      ChallengeParameters.USER_ID_FOR_SRP,
      password,
      ChallengeParameters.SRP_B,
      ChallengeParameters.SALT
    );

    const dateNow = getNowString();
    const signatureString = calculateSignature(
      hkdf,
      userPoolId,
      ChallengeParameters.USER_ID_FOR_SRP,
      ChallengeParameters.SECRET_BLOCK,
      dateNow
    );

    const { AuthenticationResult } = await post(
      cognitoUrl,
      {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target":
          "AWSCognitoIdentityProviderService.RespondToAuthChallenge",
      },
      {
        ClientId: clientId,
        ChallengeName,
        ChallengeResponses: {
          PASSWORD_CLAIM_SIGNATURE: signatureString,
          PASSWORD_CLAIM_SECRET_BLOCK: ChallengeParameters.SECRET_BLOCK,
          TIMESTAMP: dateNow,
          USERNAME: ChallengeParameters.USER_ID_FOR_SRP,
        },
      }
    );

    return AuthenticationResult;
  });
};

export const dateFormat: Intl.DateTimeFormat = new Intl.DateTimeFormat(
  "en-US",
  {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }
);

export const currentYear: number = new Date().getFullYear();

export const randomReportPeriod: number = faker.number.int({ min: 1, max: 2 });

export const randomReportYear: number = faker.number.int({
  min: currentYear,
  max: currentYear + 1,
});

export const quarterlyKeyValueGenerator = (
  year: number,
  period: number,
  name: string,
  numType: string | null
): any => {
  const obj: ReportFieldData = {};
  let startYear: number = year;
  let startQuarter: number = period === 1 ? 1 : 3;

  for (let i = 0; i < 12; i++) {
    const key: string = `${name}${startYear}Q${startQuarter}`;

    switch (numType) {
      case "int":
        obj[key] = `${faker.number.int({ min: 1, max: 100 })}`;
        break;
      case "float":
        obj[key] = `${faker.number.float({
          min: 99.01,
          max: 99.99,
          fractionDigits: 2,
        })}`;
        break;
      default:
        obj[key] = "";
        break;
    }

    if (startQuarter === 4) {
      startQuarter = 0;
    }

    startQuarter++;

    if (startQuarter === 1) {
      startYear++;
    }
  }

  return obj;
};
