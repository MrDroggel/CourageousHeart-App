// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["prettier"],
  ignorePatterns: ["!.prettier.config.js"],
  rules: {
    "prettier/prettier": ["error", { endOfLine: "auto" }],
  },
  env: {
    jest: true,
  },
};
