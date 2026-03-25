import * as LD from "@launchdarkly/node-server-sdk";

export const getLaunchDarklyClient = async () => {
  const fallback = {
    variation: (_key: string, _context: any, defaultValue: Promise<any>) =>
      defaultValue,
  } as LD.LDClient;
  const sdkKey = process.env.launchDarklyServer;

  if (!sdkKey) {
    console.error(
      "Missing LaunchDarkly SDK server key. Soft failing to fallback client."
    );
    return fallback;
  }

  try {
    const localFlags = process.env.launchDarklyLocalFlags
      ? JSON.parse(process.env.launchDarklyLocalFlags)
      : {};
    const { local = false, flags = null } = localFlags;

    if (local && flags) {
      return {
        variation: (flagName: string) => flags[flagName],
      };
    }

    const client = LD.init(sdkKey, {
      baseUri: "https://clientsdk.launchdarkly.us",
      streamUri: "https://clientstream.launchdarkly.us",
      eventsUri: "https://events.launchdarkly.us",
    });
    await client.waitForInitialization({ timeout: 60 });
    return client;
  } catch (error) {
    console.error(error);
    return fallback;
  }
};

export const getFlagValue = async (flagName: string) => {
  const client = await getLaunchDarklyClient();
  const context = { kind: "system", key: "backend-api" };
  return client.variation(flagName, context, false);
};

export const isFeatureFlagEnabled = async (flagName: string) => {
  const localFlags = process.env.launchDarklyLocalFlags
    ? JSON.parse(process.env.launchDarklyLocalFlags)
    : {};
  const { local = false } = localFlags;

  const flagValue = await getFlagValue(flagName);

  console.log(
    `FEATURE FLAG: ${flagName}, enabled: ${flagValue}, local: ${local}`
  );
  return flagValue;
};
