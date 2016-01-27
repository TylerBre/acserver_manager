var app = require('../../app.js');

module.exports = function () {

  app.io.on('connection', function (socket) {
    socket.on('chat:join', function (lobbyID) {
      socket.join(roomName(parseInt(lobbyID, 10)));
    });

    socket.on('chat:message', function (data) {
      var id = parseInt(data.lobbyID, 10);
      var room = roomName(id);
      var msg = message(data.user, data.message);

      db.cache.get({'lobby': id}).then(function (lobby) {
        lobby.chat.push(msg);
        return lobby;
      }).then(function (lobby) {
        return db.cache.set({'lobby': id}, lobby);
      }).catch(console.log).finally(function () {
        app.io.to(room).emit('message', msg);
      });
    });

    socket.on('chat:typing_done', function (data) {
      var id = parseInt(data.lobbyID, 10);
      var room = roomName(id);
      app.io.to(room).emit('typing_done', data.user);
    });

    socket.on('chat:typing_start', function (data) {
      var id = parseInt(data.lobbyID, 10);
      var room = roomName(id);
      app.io.to(room).emit('typing_start', data.user);
    });
  });

  function roomName (id) {
    return 'lobby-chat-' + id;
  }

  function message (user, message) {
    return {
      user: user,
      message: message,
      time: Date.now()
    }
  }
};
