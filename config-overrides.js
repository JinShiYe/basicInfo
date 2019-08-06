const {override, fixBabelImports, addLessLoader} = require('customize-cra');
module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: {
            'primary-color': '#09c',
            'font-size-base': '12px',
            'form-item-margin-bottom': '12px',
            'border-radius-base': '0px',
            'border-radius-sm': '0px',

        },
    }),
);
