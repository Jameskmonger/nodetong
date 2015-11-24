require.config({
  paths: {
    'socket.io': '/socket.io/socket.io',
    app: '/script/app'
  }
});

requirejs(['app/main']);
