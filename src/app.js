const express = require("express");
const { PedidoService } = require("./services/pedidoService");
const criarRotasPedido = require("./routes/pedidoRoutes");
const errorHandler = require("./middlewares/errorHandler");

function criarApp(service = new PedidoService()) {
  const app = express();
  app.use(express.json());
  app.use("/pedidos", criarRotasPedido(service));
  app.use((req, res) => res.status(404).json({ mensagem: `Rota não encontrada: ${req.method} ${req.path}` }));
  app.use(errorHandler);
  return app;
}

module.exports = criarApp;
