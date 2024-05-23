const { defineConfig } = require("cypress");
require("dotenv").config({ path: "../../.env" });

module.exports = defineConfig({
  experimentalStudio: true,
  redirectionLimit: 20,
  retries: 2,
  watchForFileChanges: true,
  fixturesFolder: "fixtures",
  screenshotsFolder: "screenshots",
  videosFolder: "videos",
  downloadsFolder: "downloads",
  types: ["cypress", "cypress-axe"],
  video: true,
  env: {
    STATE_USER_EMAIL: process.env.CYPRESS_STATE_USER_EMAIL,
    ADMIN_USER_EMAIL: process.env.CYPRESS_ADMIN_USER_EMAIL,
    // pragma: allowlist nextline secret
    ADMIN_USER_PASSWORD: process.env.CYPRESS_ADMIN_USER_PASSWORD,
    // pragma: allowlist nextline secret
    STATE_USER_PASSWORD: process.env.CYPRESS_STATE_USER_PASSWORD,
  },
  e2e: {
    baseUrl: "http://localhost:3000/",
    testIsolation: false,
    experimentalRunAllSpecs: true,
    setupNodeEvents(on, _config) {
      on("task", {
        log(message) {
          // eslint-disable-next-line no-console
          console.log(message);

          return null;
        },
        table(message) {
          // eslint-disable-next-line no-console
          console.table(message);

          return null;
        },
      });
    },
  },
});
