/* eslint-disable no-console */
const {
  SRPClient,
  calculateSignature,
  getNowString,
} = require("amazon-user-pool-srp-client");
const { faker } = require("@faker-js/faker");

const apiUrl = process.env.API_URL;
const clientId = process.env.COGNITO_USER_POOL_CLIENT_ID;
const region = process.env.COGNITO_USER_POOL_ID.split("_")[0];
const userPoolId = process.env.COGNITO_USER_POOL_ID.split("_")[1];
const cognitoUrl = `https://cognito-idp.${region}.amazonaws.com`;

const get = async (url, headers) => {
  const request = {
    method: "GET",
    headers,
    cache: "no-cache",
  };

  try {
    const response = await fetch(url, request);
    return response.json();
  } catch (error) {
    console.error(error);
  }
};

const getApi = async (url, headers) => {
  return get(`${apiUrl}${url}`, headers);
};

const post = async (url, headers, body) => {
  const request = {
    method: "POST",
    headers,
    body: body ? JSON.stringify(body) : null,
  };

  try {
    const response = await fetch(url, request);
    return response.json();
  } catch (error) {
    console.error(error);
  }
};

const postApi = async (url, headers, body) => {
  return post(`${apiUrl}${url}`, headers, body);
};

const put = async (url, headers, body) => {
  const request = {
    method: "PUT",
    headers,
    body: body ? JSON.stringify(body) : null,
  };

  try {
    const response = await fetch(url, request);
    return response.json();
  } catch (error) {
    console.error(error);
  }
};

const putApi = async (url, headers, body) => {
  return put(`${apiUrl}${url}`, headers, body);
};

const del = async (url, headers) => {
  const request = {
    url,
    method: "delete",
    headers,
  };

  try {
    const response = await fetch(url, request);
    return response.json();
  } catch (error) {
    console.error(error);
  }
};

const deleteApi = async (url, headers) => {
  return del(`${apiUrl}${url}`, headers);
};

const login = async (email, password) => {
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
  ).then(({ ChallengeName, ChallengeParameters }) => {
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

    return post(
      cognitoUrl,
      {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target":
          "AWSCognitoIdentityProviderService.RespondToAuthChallenge",
      },
      {
        ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
        ChallengeName,
        ChallengeResponses: {
          PASSWORD_CLAIM_SIGNATURE: signatureString,
          PASSWORD_CLAIM_SECRET_BLOCK: ChallengeParameters.SECRET_BLOCK,
          TIMESTAMP: dateNow,
          USERNAME: ChallengeParameters.USER_ID_FOR_SRP,
        },
      }
    ).then(({ AuthenticationResult }) => AuthenticationResult);
  });
};

const currentYear = new Date().getFullYear();

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "2-digit",
  day: "2-digit",
  year: "numeric",
});

const randomReportPeriod = faker.number.int({ min: 1, max: 2 });

const randomReportYear = faker.number.int({
  min: currentYear,
  max: currentYear + 1,
});

const createdLog = (obj, type) => {
  const { id } = obj;
  console.log(`${type} created: ${id}`);
};

const expandedLog = (json) => {
  console.log(JSON.stringify(json, null, 2));
};

const quarterlyKeyGenerator = (year, period, name, numType) => {
  const obj = {};
  let startYear = year;
  let startQuarter = period === 1 ? 1 : 3;

  for (let i = 0; i < 12; i++) {
    const key = `${name}${startYear}Q${startQuarter}`;

    switch (numType) {
      case "int":
        obj[key] = `${faker.number.int({ min: 1, max: 100 })}`;
        break;
      case "float":
        obj[key] = `${faker.number.float({
          min: 1,
          max: 100,
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

module.exports = {
  createdLog,
  dateFormat,
  deleteApi,
  expandedLog,
  getApi,
  login,
  postApi,
  putApi,
  quarterlyKeyGenerator,
  randomReportPeriod,
  randomReportYear,
};
