const socket = io();

// Editor
const pythonEditor = CodeMirror.fromTextArea(document.getElementById("python-code"), {
  mode: "python",
  lineNumbers: true
});

const jsEditor = CodeMirror.fromTextArea(document.getElementById("js-code"), {
  mode: "javascript",
  lineNumbers: true
});

// Run
function runPython() {
  const code = pythonEditor.getValue();
  const output = code.includes("hello") ? "Hello" : "Python result...";
  document.getElementById("python-output").innerText = output;
}

function runJS() {
  const code = jsEditor.getValue();
  try {
    const result = eval(code);
    document.getElementById("js-output").innerText = result ?? "JS executed";
  } catch(e) {
    document.getElementById("js-output").innerText = "Error: " + e.message;
  }
}

document.getElementById("run-btn").addEventListener("click", () => {
  runPython();
  runJS();
});

// Login e join room
document.getElementById("join-room-btn").addEventListener("click", () => {
  const username = document.getElementById("username").value || "Guest";
  const room = document.getElementById("room").value || "default";
  socket.emit("login", username);
  socket.emit("join-room", room);
  alert(Você entrou no projeto: ${room});
});

// Sync Python -> Room
pythonEditor.on("change", () => {
  const room = document.getElementById("room").value || "default";
  const code = pythonEditor.getValue();
  socket.emit("python-change", { room, code });

  // Transpilação básica para JS
  jsEditor.setValue(code.replace(/print\((.+)\)/g, "console.log($1);"));
  socket.emit("js-change", { room, code: jsEditor.getValue() });
});

// Sync JS -> Room
jsEditor.on("change", () => {
  const room = document.getElementById("room").value || "default";
  const code = jsEditor.getValue();
  socket.emit("js-change", { room, code });
});

// Recebe updates
socket.on("update-python", (code) => {
  const cursor = pythonEditor.getCursor();
  pythonEditor.setValue(code);
  pythonEditor.setCursor(cursor);
});

socket.on("update-js", (code) => {
  const cursor = jsEditor.getCursor();
  jsEditor.setValue(code);
  jsEditor.setCursor(cursor);
});