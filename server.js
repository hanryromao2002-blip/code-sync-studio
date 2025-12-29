const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const PORT = 3000;

app.use(express.static(__dirname));

let rooms = {}; // para projetos separados

io.on("connection", (socket) => {
  console.log("Novo usuário conectado:", socket.id);

  // login simples: envia username
  socket.on("login", (username) => {
    socket.username = username || "Guest";
  });

  // juntar a room (projeto)
  socket.on("join-room", (room) => {
    socket.join(room);
    if (!rooms[room]) rooms[room] = { python: "", js: "" };
    // envia código atual para novo usuário
    socket.emit("update-python", rooms[room].python);
    socket.emit("update-js", rooms[room].js);
  });

  // mudanças Python
  socket.on("python-change", ({ room, code }) => {
    rooms[room].python = code;
    socket.to(room).emit("update-python", code);
  });

  // mudanças JS
  socket.on("js-change", ({ room, code }) => {
    rooms[room].js = code;
    socket.to(room).emit("update-js", code);
  });

  socket.on("disconnect", () => {
    console.log("Usuário desconectado:", socket.id);
  });
});

http.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});