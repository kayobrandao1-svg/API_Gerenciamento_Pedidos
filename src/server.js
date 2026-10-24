const criarApp = require("./app");

const porta = process.env.PORT || 3000;
criarApp().listen(porta, () => {
  console.log(`API de pedidos disponível em http://localhost:${porta}`);
});
