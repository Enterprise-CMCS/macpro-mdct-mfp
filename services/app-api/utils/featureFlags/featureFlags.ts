import * as LD from "@launchdarkly/node-server-sdk";

export const getLaunchDarklyClient = async () => {
  try {
    const client = LD.init(process.env.LD_SDK_KEY!, {
      baseUri: "https://clientsdk.launchdarkly.us",
      streamUri: "https://clientstream.launchdarkly.us",
      eventsUri: "https://events.launchdarkly.us",
    });
    await client.waitForInitialization({ timeout: 60 });
    return client;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);

    // Build a fallback client
    const fallback = {
      variation: (_key: string, _context: any, defaultValue: Promise<any>) =>
        defaultValue,
    } as LD.LDClient;
    return fallback;
  }
};

export const getFlagValue = async (flagName: string) => {
  const client = await getLaunchDarklyClient();
  const context = { kind: "system", key: "backend-api" };
  return client.variation(flagName, context, false);
};

export const isFeaturedFlagEnabled = async (flagName: string) => {
  // const flagValue = true;
  const flagValue = await getFlagValue(flagName);

  // eslint-disable-next-line no-console
  console.log(`FEATURE FLAG: ${flagName}, enabled: ${flagValue}`);
  return flagValue;
};
