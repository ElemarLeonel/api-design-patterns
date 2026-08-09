# Simple Factory

## O que é e para que serve

A **Simple Factory** centraliza a escolha de qual objeto concreto criar. É como o caixa de uma lanchonete: você pede “PIX” ou “cartão”, e ele encaminha ao meio de pagamento correto; você não precisa conhecer a implementação de cada operadora.

`PaymentGatewayFactory.createGateway` devolve um `PixGateway` ou `CreditCardGateway` pela interface `IPaymentGateway`.

> Este exemplo é uma *Simple Factory*, uma variação prática do conceito de Factory; não é o padrão GoF Factory Method em sua forma clássica de subclasses criadoras.

## Quando usar

- O cliente precisa de uma interface, mas não deve escolher ou instanciar classes concretas.
- A escolha depende de uma configuração, tipo ou dado de entrada.
- A criação tem validações ou detalhes repetidos.

## Vantagens

- Centraliza a lógica de criação.
- Reduz o acoplamento do cliente com classes concretas.
- Torna a troca de implementação mais localizada.

## Desvantagens

- Um `switch` grande precisa ser alterado ao incluir novos tipos, contrariando parcialmente o princípio aberto/fechado.
- Pode virar uma fábrica genérica demais.

## Combinações úteis

- **Strategy:** a fábrica escolhe uma estratégia conforme o contexto.
- **Adapter:** cria o adapter correto para cada fornecedor externo.
- **Facade:** a fachada usa fábricas para montar seus colaboradores sem expor detalhes.
