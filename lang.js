const lang = "pt";

const translations = {
  pt: {
    runJS: "Executar JS",
    runPy: "Executar Python",
    runAll: "Executar Tudo",
    jsOk: "✔ JavaScript executado com sucesso!",
    pyOk: "✔ Python executado com sucesso!",
    loadingPy: "Carregando Python..."
  },
  en: {
    runJS: "Run JS",
    runPy: "Run Python",
    runAll: "Run All",
    jsOk: "✔ JavaScript executed successfully!",
    pyOk: "✔ Python executed successfully!",
    loadingPy: "Loading Python..."
  }
};

function t(key) {
  return translations[lang][key];
}