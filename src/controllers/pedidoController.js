function criarPedido(service) {
  return (req, res, next) => {
    try {
      const pedido = service.criar(req.body || {});
      return res.status(201).json(pedido);
    } catch (erro) {
      return next(erro);
    }
  };
}

function listarPedidos(service) {
  return (_req, res, next) => {
    try {
      return res.status(200).json(service.listar());
    } catch (erro) {
      return next(erro);
    }
  };
}

function consultarPedido(service) {
  return (req, res, next) => {
    try {
      const pedido = service.buscarPorId(req.params.id);
      if (!pedido) {
        return res.status(404).json({ mensagem: "Pedido não encontrado." });
      }
      return res.status(200).json(pedido);
    } catch (erro) {
      return next(erro);
    }
  };
}

function atualizarStatus(service) {
  return (req, res, next) => {
    try {
      const pedido = service.atualizarStatus(req.params.id, req.body?.status);
      return res.status(200).json(pedido);
    } catch (erro) {
      return next(erro);
    }
  };
}

module.exports = { criarPedido, listarPedidos, consultarPedido, atualizarStatus };
