const { defineConfig } = require("cypress");

module.exports = defineConfig({
  video: true,
  env: {
    STATE_USER_EMAIL: "cypressstateuser@test.com",
    ADMIN_USER_EMAIL: "cypressadminuser@test.com",
  },
  e2e: {
    baseUrl: "http://127.0.0.1:3000/",
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
