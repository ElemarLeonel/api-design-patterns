# Strategy

## O que é e para que serve

O **Strategy** troca uma regra ou algoritmo sem mudar quem o utiliza. É como escolher uma rota no aplicativo de mapas: o destino é o mesmo, mas você pode usar a rota mais rápida, mais barata ou sem pedágio.

`IShippingStrategy` é o contrato para frete. `NormalShipping`, `ExpressShipping` e `PickupShipping` calculam o custo de maneiras diferentes; o pedido usa a estratégia escolhida sem depender de cada regra.

## Quando usar

- Há várias formas de realizar a mesma tarefa.
- Um grande `if` ou `switch` escolhe algoritmos e tende a crescer.
- A regra precisa ser alterada por contexto ou configuração.

## Vantagens

- Isola cada regra e facilita testes.
- Adiciona novas alternativas sem mudar o código que as usa.
- Remove condicionais extensas do fluxo principal.

## Desvantagens

- Cria mais classes e interfaces.
- O cliente ainda precisa saber qual estratégia selecionar, salvo se outra camada fizer essa escolha.

## Combinações úteis

- **Factory:** escolhe a estratégia a partir de um tipo ou configuração.
- **Builder:** recebe a estratégia como parte da montagem, como no `OrderBuilder`.
- **Template Method:** compartilha o esqueleto de um algoritmo e deixa etapas variáveis para estratégias.
