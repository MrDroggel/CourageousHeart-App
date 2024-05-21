// lint-staged.config.js
module.exports = {
  "*.{js,jsx}": ["npm run lint", "npm run test"],
  "*.{ts,tsx}": [() => "npm run type:check", "npm run lint"],
};
