// import darkTheme from '@ant-design/dark-theme';
const darkTheme = require('@ant-design/dark-theme');
const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: Object.assign({}, darkTheme.default, {
      '@border-radius-base': '0',
      '@border-radius-sm': '0',
    }),
  }),
);