/* eslint-disable no-console */
import { get, put, post, del } from "aws-amplify/api";
import { AnyObject } from "types";
import { updateTimeout } from "utils";

const apiName = "mfp";

/**
 * Wrap the AWS API so we can handle any before or after behaviors.
 * Below we just key off of these API calls as our source of user activity to make sure
 * credentials don't expire.
 */
const apiRequest = async (request: any, path: string, options: AnyObject) => {
  try {
    updateTimeout();
    const { body } = await request({ apiName, path, options }).response;
    const res = await body.text(); // body.json() dies on an empty response, spectacularly
    return res && res.length > 0 ? JSON.parse(res) : null;
  } catch (e: any) {
    // Return our own error for handling in the app
    const info = `Request Failed - ${path} - ${e.response?.body}`;
    console.log(e);
    console.log(info);
    throw new Error(info);
  }
};

export const apiLib = {
  del: async (path: string, options: AnyObject) =>
    apiRequest(del, path, options),
  get: async (path: string, options: AnyObject) =>
    apiRequest(get, path, options),
  post: async (path: string, options: AnyObject) =>
    apiRequest(post, path, options),
  put: async (path: string, options: AnyObject) =>
    apiRequest(put, path, options),
};
