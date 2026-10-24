const express = require("express");
const {
  criarPedido,
  listarPedidos,
  consultarPedido,
  atualizarStatus,
} = require("../controllers/pedidoController");

function criarRotasPedido(service) {
  const router = express.Router();
  router.post("/", criarPedido(service));
  router.get("/", listarPedidos(service));
  router.get("/:id", consultarPedido(service));
  router.patch("/:id/status", atualizarStatus(service));
  return router;
}

module.exports = criarRotasPedido;
