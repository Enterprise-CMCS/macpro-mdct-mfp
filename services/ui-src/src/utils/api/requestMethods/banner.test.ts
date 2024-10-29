import { getBanner, writeBanner, deleteBanner } from "./banner";
// utils
import { bannerId } from "../../../constants";
import { mockBannerData } from "utils/testing/setupJest";
import { AnyObject } from "types";

const mockDel = jest.fn();
const mockGet = jest.fn();
const mockPost = jest.fn();
jest.mock("../apiLib", () => ({
  apiLib: {
    del: (path: string, options: AnyObject) => mockDel(path, options),
    get: (path: string, options: AnyObject) => mockGet(path, options),
    post: (path: string, options: AnyObject) => mockPost(path, options),
  },
}));

describe("Test banner methods", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("getBanner", async () => {
    await getBanner(bannerId);
    expect(mockGet).toHaveBeenCalledTimes(1);
  });

  test("postBanner", async () => {
    await writeBanner(mockBannerData);
    expect(mockPost).toHaveBeenCalledTimes(1);
  });

  test("delBanner", async () => {
    await deleteBanner(bannerId);
    expect(mockDel).toHaveBeenCalledTimes(1);
  });
});
