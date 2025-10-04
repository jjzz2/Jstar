module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['> 1%', 'last 2 versions', 'not ie <= 8'],
        },
        modules: false,
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
        development: process.env.NODE_ENV === 'development',
      },
    ],
  ],
  plugins: [
    // 支持动态导入
    '@babel/plugin-syntax-dynamic-import',
    
    // 支持类属性
    '@babel/plugin-proposal-class-properties',
    
    // 支持可选链和空值合并
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    
    // 支持装饰器
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    
    // 支持私有方法
    '@babel/plugin-proposal-private-methods',
    
    // 优化运行时
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: false,
        helpers: true,
        regenerator: true,
        useESModules: false,
      },
    ],
    
    // 支持import()语法
    'babel-plugin-dynamic-import-node',
    
    // 支持lodash按需导入
    'lodash',
    
    // 支持antd按需导入
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
      'antd',
    ],
  ],
  env: {
    development: {
      plugins: [
        // 开发环境热更新
        'react-hot-loader/babel',
      ],
    },
    production: {
      plugins: [
        // 生产环境移除console
        ['transform-remove-console', { exclude: ['error', 'warn'] }],
        
        // 生产环境优化
        '@babel/plugin-transform-react-constant-elements',
        '@babel/plugin-transform-react-inline-elements',
      ],
    },
  },
};
