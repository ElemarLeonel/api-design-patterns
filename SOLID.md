# SOLID aplicado na API

Este documento explica os cinco principios SOLID e mostra como eles aparecem na versao refatorada da API, localizada em `src/after`.

SOLID e um conjunto de boas praticas de design orientado a objetos que ajuda a criar codigo mais coeso, extensivel, testavel e menos acoplado. No contexto desta API de pedidos de e-commerce, esses principios aparecem principalmente por meio da separacao entre Controller, Facade, Service, Repository, Strategies, Factories, Observers, Adapters, Bridges, Builders e Decorators.

---

## S - Single Responsibility Principle

**Principio da Responsabilidade Unica:** uma classe deve ter apenas um motivo para mudar.

Na versao `before`, o `OrderController` concentra validacao, SQL, calculo de frete, pagamento, persistencia e notificacoes. Isso faz com que qualquer mudanca de regra afete a mesma classe.

Na versao `after`, as responsabilidades foram distribuidas:

- `src/after/controllers/OrderController.ts`: recebe a requisicao HTTP, valida os dados obrigatorios e envia a resposta.
- `src/after/facades/CheckoutFacade.ts`: oferece uma entrada simples para o fluxo de checkout.
- `src/after/services/OrderService.ts`: orquestra a regra de negocio do pedido.
- `src/after/repositories/SQLiteOrderRepository.ts`: concentra a persistencia no SQLite.
- `src/after/strategies/*.ts`: calcula o frete.
- `src/after/factories/*.ts`: cria gateways de pagamento.
- `src/after/observers/*.ts`: notifica interessados quando o pedido muda.

Exemplo aplicado:

```ts
export class OrderController {
  public async createOrder(req: Request, res: Response): Promise<void> {
    const result = await this.checkoutFacade.processCheckout({
      customerName, items, shippingType, paymentMethod,
      giftWrap: giftWrap || false, insurance: insurance || false
    });

    res.status(201).json(result);
  }
}
```

O controller nao sabe como calcular frete, salvar no banco ou enviar notificacoes. Ele apenas recebe a requisicao e delega o fluxo.

---

## O - Open/Closed Principle

**Principio Aberto/Fechado:** o codigo deve estar aberto para extensao, mas fechado para modificacao.

A API aplica esse principio principalmente com o Strategy, Decorator, Observer e Factory.

### Frete com Strategy

O contrato `IShippingStrategy` define apenas o que qualquer frete precisa fazer:

```ts
export interface IShippingStrategy {
  calculate(subtotal: number): number;
}
```

As classes `NormalShipping`, `ExpressShipping` e `PickupShipping` implementam esse contrato. Para adicionar um novo tipo de frete, como `DroneShipping`, basta criar uma nova classe que implemente `IShippingStrategy` e registra-la no mapa de estrategias do `OrderService`.

O codigo consumidor continua chamando:

```ts
const shippingCost = strategy.calculate(subtotal);
```

Ou seja, o comportamento pode ser estendido sem reescrever a regra principal de calculo.

### Adicionais com Decorator

O pedido base fica em `BaseOrder`, enquanto os adicionais ficam em decoradores como:

- `GiftWrapDecorator`
- `DeliveryInsuranceDecorator`

Isso permite adicionar comportamentos ao pedido sem alterar a classe base.

---

## L - Liskov Substitution Principle

**Principio da Substituicao de Liskov:** classes ou implementacoes concretas devem poder substituir seus contratos sem quebrar o sistema.

Na API, esse principio aparece quando o codigo depende de interfaces e usa implementacoes concretas de forma intercambiavel.

Exemplo com pagamento:

```ts
export interface IPaymentGateway {
  processPayment(amount: number): Promise<{ success: boolean; transactionId: string }>;
}
```

Tanto `PixGateway` quanto `CreditCardGateway` seguem esse contrato. Para o `OrderService`, nao importa se o pagamento veio por PIX ou cartao; ambos podem ser usados da mesma forma:

```ts
const paymentGateway = PaymentGatewayFactory.createGateway(paymentMethod);
const paymentResult = await paymentGateway.processPayment(finalTotalPrice);
```

O mesmo raciocinio vale para fretes:

- `NormalShipping`
- `ExpressShipping`
- `PickupShipping`

Todas essas classes podem substituir `IShippingStrategy` sem alterar o codigo que calcula o frete.

---

## I - Interface Segregation Principle

**Principio da Segregacao de Interfaces:** uma classe nao deve ser obrigada a depender de metodos que nao usa.

A API evita interfaces grandes e genericas. Em vez disso, usa contratos pequenos e focados:

- `IShippingStrategy`: apenas `calculate`.
- `IPaymentGateway`: apenas `processPayment`.
- `ITrackingService`: apenas a operacao de rastreio necessaria.
- `IOrderObserver`: apenas o metodo exigido para reagir a eventos de pedido.
- `ICommand`: apenas o metodo de execucao do comando.

Exemplo:

```ts
export interface IPaymentGateway {
  processPayment(amount: number): Promise<{ success: boolean; transactionId: string }>;
}
```

Um gateway de pagamento nao precisa implementar metodos de frete, notificacao ou persistencia. Ele depende somente do contrato necessario para sua responsabilidade.

Um ponto de atencao e `IOrderRepository`, que agrupa busca de produto, salvamento de pedido e salvamento de item. Para esta API didatica, isso e aceitavel. Em uma API maior, poderia ser dividido em contratos menores, como `IProductRepository` e `IOrderWriterRepository`, caso diferentes servicos passassem a usar apenas parte dessas operacoes.

---

## D - Dependency Inversion Principle

**Principio da Inversao de Dependencia:** modulos de alto nivel nao devem depender diretamente de detalhes de baixo nivel. Ambos devem depender de abstracoes.

O melhor exemplo esta no `OrderService`, que recebe um `IOrderRepository` no construtor:

```ts
constructor(orderRepository: IOrderRepository) {
  this.orderRepository = orderRepository;
}
```

Isso significa que o servico de pedidos nao precisa saber se os dados estao em SQLite, PostgreSQL, MongoDB ou em memoria para testes. Ele conhece apenas o contrato:

```ts
export interface IOrderRepository {
  findProductById(id: number): Promise<any>;
  saveOrder(order: {...}): Promise<number>;
  saveOrderItem(orderId: number, item: {...}): Promise<void>;
}
```

A implementacao concreta fica separada:

```ts
export class SQLiteOrderRepository implements IOrderRepository {
  // detalhes de SQL e sqlite3
}
```

Assim, o fluxo principal depende da abstracao `IOrderRepository`, enquanto o detalhe tecnico fica isolado em `SQLiteOrderRepository`.

Tambem ha exemplos desse principio em:

- `IShippingStrategy`: o builder recebe uma estrategia, nao uma classe fixa de frete.
- `IPaymentGateway`: o service processa pagamentos por meio de um contrato.
- `ITrackingService`: o service usa uma interface de rastreio, enquanto o adapter esconde a API legada.
- `INotificationProvider`: os canais de notificacao dependem de um provedor abstrato.

---

## Resumo dos principios na API

| Principio | Aplicacao na API |
| --- | --- |
| SRP | Controller, Service, Repository, Strategy, Factory e Observer possuem responsabilidades separadas. |
| OCP | Novos fretes, pagamentos, notificacoes e adicionais podem ser adicionados por novas classes. |
| LSP | Implementacoes como `PixGateway`, `CreditCardGateway` e estrategias de frete substituem seus contratos sem quebrar o fluxo. |
| ISP | Interfaces pequenas evitam que classes implementem metodos desnecessarios. |
| DIP | `OrderService` depende de abstracoes como `IOrderRepository`, `IShippingStrategy`, `IPaymentGateway` e `ITrackingService`. |

---

## Conclusao

A versao `src/after` demonstra SOLID na pratica porque distribui responsabilidades, reduz acoplamento e permite evoluir a API por extensao. Os padroes de projeto usados no projeto nao existem isoladamente: eles ajudam a concretizar os principios SOLID dentro de um fluxo real de criacao, pagamento, persistencia e notificacao de pedidos.
