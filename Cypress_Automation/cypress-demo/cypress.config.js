const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000", // change to your dev server's port
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
