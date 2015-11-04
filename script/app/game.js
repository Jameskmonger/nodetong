define(['./key_handler', 'domReady'], function (key_handler) {
  // Current pressed keys can be accessed with key_handler.pressed

  loaded();

  function loaded() {
    requestAnimationFrame(draw);
  }

  function draw() {
    requestAnimationFrame(draw);
  }
});
