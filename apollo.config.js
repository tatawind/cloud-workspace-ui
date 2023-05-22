module.exports = {
    client: {
      service: {
        name: 'my-app',
        // GraphQL API 的 URL
        url: 'http://127.0.0.1:9002/api/worksapce/graphql',
      },
      // 通过扩展名选择需要处理的文件
      includes: [
        'src/**/*.vue',
        'src/**/*.ts',
      ],
    },
  }