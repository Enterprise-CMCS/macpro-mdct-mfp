import { getBanner, writeBanner, deleteBanner } from "./banner";
// utils
import { bannerId } from "../../../constants";
import { mockBannerData } from "utils/testing/setupJest";
import { initAuthManager } from "utils/auth/authLifecycle";

describe("utils/banner", () => {
  beforeEach(async () => {
    jest.useFakeTimers();
    initAuthManager();
    jest.runAllTimers();
  });

  describe("getBanner()", () => {
    test("executes", () => {
      expect(getBanner(bannerId)).toBeTruthy();
    });
  });

  describe("writeBanner()", () => {
    test("executes", () => {
      expect(writeBanner(mockBannerData)).toBeTruthy();
    });
  });

  describe("deleteBanner()", () => {
    test("executes", () => {
      expect(deleteBanner(bannerId)).toBeTruthy();
    });
  });
});
