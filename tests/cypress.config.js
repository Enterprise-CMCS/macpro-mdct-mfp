const { defineConfig } = require("cypress");

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
    STATE_USER_EMAIL: "cypressstateuser@test.com",
    ADMIN_USER_EMAIL: "cypressadminuser@test.com",
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
