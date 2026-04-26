function registerChatHandlers(io) {
  io.on('connection', (socket) => {
    socket.on('join-project', ({ projectId }) => {
      if (projectId) socket.join(projectId);
    });

    socket.on('leave-project', ({ projectId }) => {
      if (projectId) socket.leave(projectId);
    });

    socket.on('send-message', (payload) => {
      if (!payload?.projectId) return;
      io.to(payload.projectId).emit('new-message', {
        ...payload,
        timestamp: new Date().toISOString()
      });
    });
  });
}

module.exports = { registerChatHandlers };
