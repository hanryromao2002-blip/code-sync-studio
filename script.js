// =======================
// CODE SYNC STUDIO - MVP
// Script Principal
// =======================

// =======================
// EXECUÇÃO JAVASCRIPT
// =======================

function runJS(outputElement) {
  const output = outputElement || document.getElementById("js-output");
  output.innerText += "[JS] Executando...\n";

  const originalLog = console.log;

  console.log = function (...args) {
    output.innerText += "[JS] " + args.join(" ") + "\n";
    originalLog.apply(console, args);
  };

  try {
    const code = document.getElementById("js-code").value;
    new Function(code)();
  } catch (err) {
    output.innerText += "[JS] Erro: " + err + "\n";
  }

  console.log = originalLog;
}

// =======================
// PYTHON (PYODIDE)
// =======================

let pyodideReady = false;
let pyodide;

async function initPyodide() {
  pyodide = await loadPyodide();
  pyodideReady = true;
}

initPyodide();

async function runPython(outputElement) {
  const output = outputElement || document.getElementById("python-output");

  if (!pyodideReady) {
    output.innerText += "[Python] Carregando Python...\n";
    return;
  }

  const code = document.getElementById("python-code").value;

  try {
    const result = await pyodide.runPythonAsync(code);
    output.innerText += "[Python] " + (result ?? "(Python executado com sucesso)") + "\n";
  } catch (err) {
    output.innerText += "[Python] Erro: " + err + "\n";
  }
}

// =======================
// EXECUÇÃO DE AMBOS
// =======================

async function runAll() {
  const allOutput = document.getElementById("all-output");
  allOutput.innerText = ""; // limpa antes de executar

  runJS(allOutput);            // Executa JS e escreve no all-output
  await runPython(allOutput);  // Executa Python depois e escreve no all-output
}

// =======================
// LIGAÇÃO DOS BOTÕES
// =======================

document.getElementById("run-js").onclick = () => runJS(document.getElementById("all-output"));
document.getElementById("run-python").onclick = () => runPython(document.getElementById("all-output"));
document.getElementById("run-all").onclick = runAll;