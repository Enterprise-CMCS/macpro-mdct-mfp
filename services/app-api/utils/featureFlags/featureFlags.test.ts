import { Mock } from "vitest";
import {
  getFlagValue,
  getLaunchDarklyClient,
  isFeatureFlagEnabled,
} from "./featureFlags";
import * as LD from "@launchdarkly/node-server-sdk";

vi.mock("@launchdarkly/node-server-sdk", () => ({
  init: vi.fn(),
}));

const waitForInitialization = vi.fn().mockResolvedValue(undefined);
const variation = vi.fn().mockResolvedValue(true);

describe("utils/featureFlags", () => {
  describe("getLaunchDarklyClient()", () => {
    beforeEach(() => {
      process.env.launchDarklyServer = "mock-sdk-key";
    });

    test("creates LD client", async () => {
      (LD.init as Mock).mockReturnValue({
        variation,
        waitForInitialization,
      });

      await getLaunchDarklyClient();
      expect(LD.init).toHaveBeenCalled();
      expect(waitForInitialization).toHaveBeenCalled();

      const expectedResult = await getFlagValue("mockFlag");
      expect(variation).toHaveBeenCalled();
      expect(expectedResult).toBe(true);
    });

    test("uses fallback client for missing SDK key", async () => {
      delete process.env.launchDarklyServer;
      await getLaunchDarklyClient();

      const expectedResult = await getFlagValue("mockFlag");
      expect(expectedResult).toBe(false);
    });

    test("uses fallback client for bad SDK key", async () => {
      (LD.init as Mock).mockImplementation(() => {
        throw new Error("Some error message");
      });
      await getLaunchDarklyClient();

      const expectedResult = await getFlagValue("mockFlag");
      expect(expectedResult).toBe(false);
    });

    test("uses local flags - returns true", async () => {
      process.env.launchDarklyLocalFlags =
        '{"local": true, "flags": {"mockLocalFlag": true}}';
      await getLaunchDarklyClient();

      const expectedResult = await getFlagValue("mockLocalFlag");
      expect(expectedResult).toBe(true);
    });

    test("uses local flags - returns false", async () => {
      process.env.launchDarklyLocalFlags =
        '{"local": true, "flags": {"mockLocalFlag": false}}';
      await getLaunchDarklyClient();

      const expectedResult = await getFlagValue("mockLocalFlag");
      expect(expectedResult).toBe(false);
    });

    test("uses LD client flags - returns true", async () => {
      (LD.init as Mock).mockReturnValue({
        variation,
        waitForInitialization,
      });
      process.env.launchDarklyLocalFlags =
        '{"local": false, "flags": {"mockLocalFlag": false}}';

      await getLaunchDarklyClient();

      const expectedResult = await getFlagValue("mockLocalFlag");
      expect(expectedResult).toBe(true);
    });

    test("uses LD client flags - returns false", async () => {
      (LD.init as Mock).mockReturnValue({
        variation: vi.fn().mockResolvedValue(false),
        waitForInitialization,
      });
      process.env.launchDarklyLocalFlags =
        '{"local": false, "flags": {"mockLocalFlag": true}}';

      await getLaunchDarklyClient();

      const expectedResult = await getFlagValue("mockLocalFlag");
      expect(expectedResult).toBe(false);
    });
  });

  // TODO: fix mock not working
  describe.skip("isFeatureFlagEnabled()", () => {
    test("returns true", async () => {
      (getFlagValue as Mock).mockResolvedValueOnce(true);
      const expectedResult = await isFeatureFlagEnabled("mockFlag");
      expect(expectedResult).toBe(true);
    });

    test("returns false", async () => {
      (getFlagValue as Mock).mockResolvedValueOnce(false);
      const expectedResult = await isFeatureFlagEnabled("mockFlag");
      expect(expectedResult).toBe(false);
    });
  });
});
