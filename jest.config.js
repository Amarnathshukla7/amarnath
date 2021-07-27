module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  setupFilesAfterEnv: ["./tests/jest.setup.js"],
  setupFiles: [
    // Some of the parts of the application uses browser indexDB feature,
    // this feature doesn't exists under jest using a faker instead.
    "fake-indexeddb/auto"
  ],
  transformIgnorePatterns: ['/node_modules/(?!vue\-load\-script\-plus)']
};
