const TIPOS_VALIDOS = ["entrega", "retirada"];
const PRIORIDADES_VALIDAS = ["normal", "alta"];
const STATUS_VALIDOS = [
  "recebido",
  "em_preparacao",
  "enviado",
  "entregue",
  "cancelado",
];

const TRANSICOES = {
  recebido: ["em_preparacao", "cancelado"],
  em_preparacao: ["enviado", "cancelado"],
  enviado: ["entregue"],
  entregue: [],
  cancelado: [],
};

function validarNovoPedido(dados) {
  const erros = [];

  if (typeof dados.cliente !== "string" || dados.cliente.trim() === "") {
    erros.push("cliente deve ser um texto não vazio.");
  }
  if (typeof dados.valor !== "number" || !Number.isFinite(dados.valor) || dados.valor <= 0) {
    erros.push("valor deve ser um número maior que zero.");
  }
  if (!TIPOS_VALIDOS.includes(dados.tipo)) {
    erros.push(`tipo deve ser um destes valores: ${TIPOS_VALIDOS.join(", ")}.`);
  }
  if (!PRIORIDADES_VALIDAS.includes(dados.prioridade)) {
    erros.push(`prioridade deve ser um destes valores: ${PRIORIDADES_VALIDAS.join(", ")}.`);
  }

  return erros;
}

class PedidoService {
  constructor() {
    this.pedidos = [];
    this.proximoId = 1;
  }

  criar(dados) {
    const erros = validarNovoPedido(dados);
    if (erros.length) {
      const erro = new Error("Dados inválidos.");
      erro.status = 400;
      erro.detalhes = erros;
      throw erro;
    }

    const pedido = {
      id: this.proximoId++,
      cliente: dados.cliente.trim(),
      tipo: dados.tipo,
      valor: dados.valor,
      prioridade: dados.prioridade,
      status: "recebido",
    };
    this.pedidos.push(pedido);
    return pedido;
  }

  listar() {
    return [...this.pedidos];
  }

  buscarPorId(id) {
    return this.pedidos.find((pedido) => pedido.id === Number(id)) || null;
  }

  atualizarStatus(id, status) {
    const pedido = this.buscarPorId(id);
    if (!pedido) {
      const erro = new Error("Pedido não encontrado.");
      erro.status = 404;
      throw erro;
    }
    if (typeof status !== "string" || !STATUS_VALIDOS.includes(status)) {
      const erro = new Error(`status deve ser um destes valores: ${STATUS_VALIDOS.join(", ")}.`);
      erro.status = 400;
      throw erro;
    }
    if (!TRANSICOES[pedido.status].includes(status)) {
      const erro = new Error(`Transição de ${pedido.status} para ${status} não permitida.`);
      erro.status = 400;
      throw erro;
    }

    pedido.status = status;
    return pedido;
  }
}

module.exports = { PedidoService, TIPOS_VALIDOS, PRIORIDADES_VALIDAS, STATUS_VALIDOS, TRANSICOES };
