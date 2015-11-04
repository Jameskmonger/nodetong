require.config({
  baseUrl: '/script/modules',
  paths: {
    app: '/script/app'
  }
});

requirejs(['app/main']);
