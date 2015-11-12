define(function (require) {
  var Game = require('./Game');

  var _game = new Game();

  var Animation = require('./Animation');

  var _anim = new Animation();

  _anim.setGame(_game);

  //var anim = require('./anim');

  //var net = require('./networking');
});
