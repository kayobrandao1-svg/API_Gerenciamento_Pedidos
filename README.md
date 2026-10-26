# API de Gerenciamento de Pedidos

Projeto prático de **Tópicos Avançados em Sistemas de Informação II**. A API REST gerencia pedidos de uma pequena loja usando Node.js, Express e armazenamento em memória.

## Requisitos

- Node.js 18 ou superior e npm.
- Postman para executar os cenários manuais da coleção em `postman/`.

## Instalação e execução

Na pasta do projeto, execute:

```bash
npm install
npm start
```

A API ficará disponível em `http://localhost:3000`. Para usar outra porta, defina a variável `PORT`. Para executar os testes automatizados:

```bash
npm test
```

## Rotas

| Método | Rota | Descrição | Respostas principais |
|---|---|---|---|
| POST | `/pedidos` | Cadastra pedido | `201`, `400` |
| GET | `/pedidos` | Lista todos os pedidos | `200` |
| GET | `/pedidos/:id` | Consulta pelo identificador | `200`, `404` |
| PATCH | `/pedidos/:id/status` | Atualiza o status | `200`, `400`, `404` |

Exemplo para criar pedido:

```json
{
  "cliente": "Carlos Silva",
  "tipo": "entrega",
  "valor": 350,
  "prioridade": "normal"
}
```

O pedido criado recebe um identificador numérico e começa com o status `recebido`. Para atualizar o status, envie, por exemplo, `{"status":"em_preparacao"}` para `PATCH /pedidos/1/status`.

## Regras de validação e status

- `cliente`: texto obrigatório; espaços nas extremidades são removidos e texto vazio é rejeitado.
- `valor`: número JSON finito maior que zero. Uma string como `"350"` não é aceita como número.
- `tipo`: `entrega` ou `retirada`.
- `prioridade`: `normal` ou `alta`.
- `status`: `recebido`, `em_preparacao`, `enviado`, `entregue` ou `cancelado`.
- Identificador inexistente retorna `404`. Dados inválidos e transições não permitidas retornam `400` com mensagem JSON. Falhas inesperadas retornam `500` com mensagem genérica.

Transições permitidas:

| Status atual | Próximos status permitidos |
|---|---|
| `recebido` | `em_preparacao`, `cancelado` |
| `em_preparacao` | `enviado`, `cancelado` |
| `enviado` | `entregue` |
| `entregue` | Nenhum; estado final |
| `cancelado` | Nenhum; estado final |

O status atual não pode ser repetido na atualização. Os pedidos são mantidos somente na memória do processo; ao reiniciar a API, a lista é reiniciada.

## Arquitetura

O projeto separa responsabilidades em camadas:

- `src/routes`: associa os caminhos HTTP aos controllers.
- `src/controllers`: recebe requisições, chama o serviço e define respostas HTTP.
- `src/services`: aplica validações, regras de transição e operações sobre pedidos.
- `src/middlewares`: converte erros em respostas JSON.
- `src/app.js`: configura o Express e permite injetar o serviço nos testes.
- `src/server.js`: inicia o servidor HTTP.
- `tests/`: testes de integração com Jest e Supertest.

## Testes manuais com Postman

Importe `postman/colecao-pedidos.postman_collection.json` no Postman. A variável `baseUrl` já está definida como `http://localhost:3000`. Execute a API e rode os pedidos da coleção; para os pedidos dependentes, mantenha a ordem da coleção.

Salve capturas legíveis na pasta `evidencias/`, exibindo método, URL, corpo quando aplicável, resposta e código HTTP. Use estes nomes:

1. `01-criacao.png` — POST válido com resposta `201`.
2. `02-validacao.png` — POST inválido com resposta `400`.
3. `03-listagem.png` — GET `/pedidos` com resposta `200`.
4. `04-consulta-inexistente.png` — GET `/pedidos/99999` com resposta `404`.
5. `05-atualizacao.png` — PATCH válido com resposta `200`.

As imagens devem ser capturadas após a execução real no Postman. Não há capturas simuladas incluídas neste projeto.

## GitHub

O histórico local contém commits de desenvolvimento em etapas. Para entregar o link exigido pela disciplina, crie um repositório no GitHub, conecte-o como remoto e envie a branch principal:

```bash
git remote add origin URL_DO_SEU_REPOSITORIO
git push -u origin main
```

Inclua o link do repositório e seu RA na entrega da atividade. Não publique credenciais, tokens, `node_modules` ou arquivos `.env` com segredos.

## Uso de IA

Utilizei inteligência artificial como apoio para organizar as camadas, preparar validações e testes e revisar a documentação. Aceitei a sugestão de usar Supertest para testar os endpoints e seus códigos HTTP, pois esses comportamentos fazem parte dos requisitos da API. Executei os testes do projeto.
