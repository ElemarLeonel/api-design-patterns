# Decorator e Prototype

## O que é e para que serve

O **Decorator** adiciona comportamentos a um objeto sem mudar sua classe. É como embrulhar um presente: o presente continua lá, mas ganha uma camada extra. Camadas podem ser empilhadas.

`BaseOrder` é o pedido básico. `GiftWrapDecorator` acrescenta embrulho, e `DeliveryInsuranceDecorator` acrescenta seguro; ambos preservam a mesma interface, `IOrder`.

O módulo também usa **Prototype**: o método `clone` cria uma cópia do pedido, inclusive das camadas decoradoras. É como repetir um pedido favorito sem informar cada detalhe novamente.

## Quando usar

- Adicionais opcionais e combináveis, como taxas, descontos, logs ou permissões.
- Evitar subclasses para cada combinação possível de extras.
- Duplicar configurações complexas já prontas com Prototype.

## Vantagens

- Extras são combinados em tempo de execução.
- Cada adicional fica isolado em uma classe pequena.
- Prototype acelera a recriação de objetos configurados.

## Desvantagens

- Muitas camadas tornam a depuração e a descrição do objeto menos diretas.
- A cópia precisa ser bem projetada, principalmente quando há dados mutáveis.
- A ordem dos decorators pode importar em alguns domínios.

## Combinações úteis

- **Builder:** monta o objeto base e aplica decorators, exatamente como `OrderBuilder` faz.
- **Prototype:** clona a cadeia completa de decorators para o recurso de reorder.
- **Strategy:** permite que uma camada use regras intercambiáveis, por exemplo para cálculo de frete.
