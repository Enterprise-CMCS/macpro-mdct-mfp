#!/usr/bin/env node
import * as LD from "@launchdarkly/node-server-sdk";
import { execFileSync } from "node:child_process";

async function run() {
  const getLaunchDarklyClient = async () => {
    const sdkKey = process.env.LD_SDK_KEY_PROD;

    if (!sdkKey) {
      console.error("Missing LD_SDK_KEY_PROD. Skipping leaks report.");
      return;
    }

    try {
      const client = LD.init(sdkKey, {
        baseUri: "https://clientsdk.launchdarkly.us",
        streamUri: "https://clientstream.launchdarkly.us",
        eventsUri: "https://events.launchdarkly.us",
        logger: LD.basicLogger({ level: "warn" }),
      });
      await client.waitForInitialization({ timeout: 60 });
      return client;
    } catch (error) {
      console.error(error);
      console.log("Error connecting to LaunchDarkly.");
      return;
    }
  };

  const ldClient = await getLaunchDarklyClient();
  if (!ldClient) {
    process.exit();
  }

  const context = { kind: "system", key: "backend-api" };
  const allFlagsState = await ldClient.allFlagsState(context);
  const allFlags = allFlagsState.toJSON();
  const featureFlagNames = Object.keys(allFlags).filter(
    (key) => !key.startsWith("$")
  );
  ldClient.close();

  try {
    const commitSha = process.env.GITHUB_SHA || "main";
    const serverUrl = process.env.GITHUB_SERVER_URL;
    const repoName = process.env.GITHUB_REPOSITORY;

    const repoBaseUrl = `${serverUrl}/${repoName}/blob/${commitSha}/`;

    const searchPatterns = [
      /useFlags\(\)(?:\?\.)?([a-zA-Z0-9_]+)/g,
      /isFeatureFlagEnabled\(['"`]([a-zA-Z0-9_]+)['"`]\)/g,
    ];

    const rawGrepOutput = execFileSync(
      "git",
      [
        "grep",
        "-n",
        "-E",
        "useFlags\\(\\)|isFeatureFlagEnabled\\((['\"`])[^'\"`]+(['\"`])\\)",
        "--",
        "services/**",
        ":(exclude)*.test.*",
      ],
      { encoding: "utf8" }
    );
    const lines = rawGrepOutput.split("\n").filter(Boolean);

    const formattedLines = lines
      .map((line) => {
        const matches = line.match(/^([^:]+):([^:]+):(.*)$/);
        if (!matches) return;

        const [, fileName, lineNumber, matchingCode] = matches;

        const trimmedCode = matchingCode.trim();

        // Skip lines that are commented out
        if (
          trimmedCode.startsWith("//") ||
          trimmedCode.startsWith("/*") ||
          trimmedCode.startsWith("*")
        ) {
          return;
        }

        let lineWithUnknownFlag;

        searchPatterns.forEach((pattern) => {
          let match;
          pattern.lastIndex = 0;

          while ((match = pattern.exec(matchingCode)) !== null) {
            const flag = match[1];
            if (!featureFlagNames.includes(flag)) {
              lineWithUnknownFlag = `<${repoBaseUrl}${fileName}#L${lineNumber}|${fileName}:${lineNumber}>: ${flag}`;
            }
          }
        });

        return lineWithUnknownFlag;
      })
      .filter(Boolean);

    if (formattedLines.length > 0) {
      const formattedOutput = [
        "These files reference feature flags that do not exist in Production. Check if code should be removed:\n",
        ...formattedLines,
      ].join("\n");

      console.log(formattedOutput);
    }
  } catch (error) {
    console.error(error);
  }
}

run();
