# Repository

## O que é e para que serve

O **Repository** apresenta os dados como uma coleção do domínio, escondendo banco, SQL e detalhes de acesso. É como um bibliotecário: você pede um livro pelo assunto; não precisa saber em qual corredor ou estante ele está.

`IOrderRepository` define o contrato, enquanto `SQLiteOrderRepository` implementa a busca de produtos e a gravação de pedidos no SQLite.

## Quando usar

- A regra de negócio não deve depender de SQL ou de um banco específico.
- Quer trocar ou simular a persistência em testes.
- Há consultas e gravações repetidas que merecem um lugar próprio.

## Vantagens

- Separa persistência de regras de negócio.
- Facilita testes com implementações falsas em memória.
- Centraliza consultas e mapeamentos de dados.

## Desvantagens

- Pode duplicar recursos que um ORM já oferece.
- Abstrações genéricas demais podem esconder consultas caras ou difíceis de otimizar.

## Combinações úteis

- **Singleton:** fornece a conexão compartilhada usada pelo repositório neste exemplo.
- **Unit of Work:** coordena várias gravações como uma única transação.
- **Factory:** escolhe a implementação do repositório por ambiente ou banco.
