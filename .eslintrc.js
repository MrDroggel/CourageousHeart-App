// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  env: {
      jest: true,
  },
  extends: [
      'airbnb',
      'airbnb-typescript',
      'airbnb/hooks',
      'expo',
      'plugin:react/recommended',
      'prettier',
  ],
  parserOptions: {
      project: './tsconfig.json',
  },
  plugins: ['react', 'react-native'],
  rules: {
      'import/prefer-default-export': 0,
      'react/jsx-filename-extension': [
          1,
          { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
      ],
      'react/jsx-props-no-spreading': 0,
      'react/require-default-props': 0,
  },
};