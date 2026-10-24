const request = require("supertest");
const criarApp = require("../src/app");
const { PedidoService } = require("../src/services/pedidoService");

describe("API de gerenciamento de pedidos", () => {
  let app;

  beforeEach(() => {
    app = criarApp(new PedidoService());
  });

  test("cria um pedido válido com status recebido", async () => {
    const resposta = await request(app).post("/pedidos").send({
      cliente: "Carlos Silva",
      tipo: "entrega",
      valor: 350,
      prioridade: "normal",
    });

    expect(resposta.status).toBe(201);
    expect(resposta.body).toMatchObject({ id: 1, cliente: "Carlos Silva", status: "recebido" });
  });

  test("rejeita cliente vazio e valor inválido", async () => {
    const resposta = await request(app).post("/pedidos").send({
      cliente: "   ",
      tipo: "entrega",
      valor: 0,
      prioridade: "normal",
    });

    expect(resposta.status).toBe(400);
    expect(resposta.body.detalhes).toHaveLength(2);
  });

  test("lista pedidos cadastrados", async () => {
    await request(app).post("/pedidos").send({ cliente: "Ana", tipo: "retirada", valor: 40, prioridade: "alta" });
    const resposta = await request(app).get("/pedidos");

    expect(resposta.status).toBe(200);
    expect(resposta.body).toHaveLength(1);
  });

  test("consulta um pedido existente e retorna 404 para ID inexistente", async () => {
    const criado = await request(app).post("/pedidos").send({ cliente: "Ana", tipo: "retirada", valor: 40, prioridade: "alta" });
    expect((await request(app).get(`/pedidos/${criado.body.id}`)).status).toBe(200);
    expect((await request(app).get("/pedidos/99")).status).toBe(404);
  });

  test("permite transições válidas e rejeita uma transição inválida", async () => {
    await request(app).post("/pedidos").send({ cliente: "Ana", tipo: "entrega", valor: 40, prioridade: "normal" });
    const preparacao = await request(app).patch("/pedidos/1/status").send({ status: "em_preparacao" });
    expect(preparacao.status).toBe(200);
    expect(preparacao.body.status).toBe("em_preparacao");

    const invalida = await request(app).patch("/pedidos/1/status").send({ status: "entregue" });
    expect(invalida.status).toBe(400);
  });

  test("retorna 404 ao atualizar status de um pedido inexistente", async () => {
    const resposta = await request(app).patch("/pedidos/7/status").send({ status: "cancelado" });
    expect(resposta.status).toBe(404);
  });
});
