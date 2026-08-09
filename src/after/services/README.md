# Service Layer

## O que é e para que serve

O **Service Layer** concentra um caso de uso da aplicação, coordenando regras, persistência e integrações. É como o gerente de uma loja: ele não fabrica o produto nem opera cada caixa, mas organiza todas as etapas para que a venda aconteça.

`OrderService` orquestra o ciclo do pedido: carrega itens, calcula frete, monta o pedido, cobra, salva, envia rastreio e dispara notificações.

## Quando usar

- Um caso de uso atravessa várias entidades, repositórios e serviços externos.
- Controllers ou interfaces estão começando a acumular regras de negócio.
- Deseja uma API de negócio reutilizável por HTTP, fila e linha de comando.

## Vantagens

- Dá um lugar claro para a orquestração do negócio.
- Mantém controllers e infraestrutura menores.
- Melhora testes dos casos de uso.

## Desvantagens

- Pode virar um “serviço Deus” se reunir responsabilidades demais.
- Regras que pertencem a uma entidade podem acabar deslocadas para o serviço.

## Combinações úteis

- **Repository:** o serviço usa contratos de persistência sem conhecer SQL.
- **Facade:** oferece uma entrada ainda mais simples para clientes externos.
- **Command:** encapsula a solicitação que o serviço executará.
