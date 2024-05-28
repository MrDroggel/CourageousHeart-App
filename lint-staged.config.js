// lint-staged.config.js
module.exports = {
  "*.{js,jsx,ts,tsx}": [() => "npm run type:check", "npm run lint"],
};
