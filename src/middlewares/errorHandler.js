function errorHandler(erro, _req, res, _next) {
  const status = Number.isInteger(erro.status) ? erro.status : 500;
  const resposta = { mensagem: status === 500 ? "Erro interno do servidor." : erro.message };
  if (erro.detalhes) resposta.detalhes = erro.detalhes;
  return res.status(status).json(resposta);
}

module.exports = errorHandler;
