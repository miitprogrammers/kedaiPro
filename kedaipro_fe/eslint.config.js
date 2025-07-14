module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended", // ⬅️ Ini penting
  ],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": ["error"],
    // Tambahkan override jika perlu
    // Misal:
    // 'no-console': 'warn',
  },
};
