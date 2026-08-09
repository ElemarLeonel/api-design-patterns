# SOLID na API de pedidos

Este projeto apresenta duas versões de uma API de pedidos:

- `src/before`: uma implementação concentrada, usada para mostrar os problemas mais comuns.
- `src/after`: a versão organizada com princípios SOLID e padrões de projeto.

SOLID é um conjunto de cinco princípios para organizar código orientado a objetos. Ele não é uma regra rígida nem torna todo projeto automaticamente melhor. A ideia é facilitar mudanças, testes e manutenção quando a aplicação cresce.

> Em termos simples: SOLID ajuda cada parte do sistema a ter um papel claro e a conversar com as outras por meio de acordos bem definidos.

---

## S — Single Responsibility Principle (Responsabilidade Única)

### Fundamento

Uma classe deve ter **uma responsabilidade principal** e, por isso, um motivo claro para mudar. Isso não significa que uma classe só pode ter um método; significa que seus métodos devem colaborar para cumprir o mesmo papel.

### Analogia e comparação

Pense em um restaurante. A pessoa do caixa recebe o pedido, a cozinha o prepara e o entregador leva a refeição. Se uma única pessoa fizesse tudo, qualquer alteração — no cardápio, no pagamento ou na entrega — afetaria o mesmo trabalho.

É exatamente a diferença entre as duas versões do projeto:

| Antes (`src/before`) | Depois (`src/after`) |
| --- | --- |
| `OrderController` valida dados, executa SQL, calcula frete, processa pagamento e notifica. | Cada parte cuida de uma etapa: Controller, Facade, Service, Repository, Strategy e Observer. |
| Uma alteração em qualquer regra pode exigir mexer no controller. | Cada regra tende a mudar em seu próprio arquivo. |

### Exemplo no repositório

O controller da versão refatorada recebe a requisição, faz a validação básica e entrega o fluxo à fachada. Ele não sabe como o pedido será salvo ou pago.

Arquivo: `src/after/controllers/OrderController.ts`

```ts
const result = await this.checkoutFacade.processCheckout({
  customerName, items, shippingType, paymentMethod,
  giftWrap: giftWrap || false,
  insurance: insurance || false
});

res.status(201).json(result);
```

Já a persistência fica exclusivamente no repositório:

Arquivo: `src/after/repositories/SQLiteOrderRepository.ts`

```ts
public saveOrderItem(orderId: number, item: {
  productId: number;
  quantity: number;
  price: number;
}): Promise<void> {
  // INSERT na tabela order_items
}
```

### Vantagens

- Arquivos menores e mais fáceis de ler.
- Mudanças isoladas: alterar o banco não exige mudar a regra de frete.
- Testes mais simples, pois cada parte possui um foco.
- Menor risco de uma mudança quebrar uma responsabilidade não relacionada.

### Desvantagens e cuidados

- Há mais arquivos e classes para navegar.
- Separar demais pode gerar classes muito pequenas sem ganho real.
- É necessário definir bem quem é responsável por cada decisão.

---

## O — Open/Closed Principle (Aberto/Fechado)

### Fundamento

O código deve estar **aberto para extensão** e **fechado para modificações desnecessárias**. Na prática, novos comportamentos devem poder ser incluídos criando novas implementações, sem reescrever o fluxo estável que já funciona.

### Analogia e comparação

Uma tomada permite conectar aparelhos diferentes sem reformar a instalação elétrica a cada novo equipamento. A tomada representa o contrato; cada aparelho é uma nova implementação dele.

No projeto, o contrato de frete é a tomada e as classes de frete são os aparelhos:

```ts
export interface IShippingStrategy {
  calculate(subtotal: number): number;
}
```

Arquivo: `src/after/strategies/IShippingStrategy.ts`

Em vez de um grande `if/else` com todas as regras no controller — como ocorre em `src/before/controllers/OrderController.ts` — a versão refatorada separa os tipos de frete em classes.

### Exemplo no repositório

`NormalShipping` implementa o contrato sem alterar o serviço de pedidos.

Arquivo: `src/after/strategies/NormalShipping.ts`

```ts
export class NormalShipping implements IShippingStrategy {
  public calculate(subtotal: number): number {
    return subtotal >= 200 ? 0.00 : 15.00;
  }
}
```

Para criar, por exemplo, um frete por drone, a regra poderia nascer em uma nova classe:

```ts
class DroneShipping implements IShippingStrategy {
  public calculate(subtotal: number): number {
    return 35;
  }
}
```

O mesmo conceito aparece nos decorators `GiftWrapDecorator` e `DeliveryInsuranceDecorator`: eles acrescentam recursos ao pedido sem modificar `BaseOrder`.

### Vantagens

- Novas regras são adicionadas com menos risco ao código existente.
- Regras ficam separadas e mais fáceis de testar.
- O sistema cresce por composição, e não por cadeias enormes de condicionais.

### Desvantagens e cuidados

- O projeto ganha mais tipos para administrar.
- Uma extensão precisa ser registrada no ponto de seleção apropriado. Atualmente, por exemplo, `OrderService` mantém o mapa de estratégias de frete.
- Não vale criar uma abstração para uma regra que jamais deverá variar.

---

## L — Liskov Substitution Principle (Substituição de Liskov)

### Fundamento

Qualquer implementação de um contrato deve poder ocupar o lugar de outra sem surpreender quem a usa. Em outras palavras: se o código espera um `IShippingStrategy`, toda estratégia válida precisa calcular e devolver um valor de frete de maneira compatível.

### Analogia e comparação

Um controle remoto funciona com pilhas de marcas diferentes, desde que todas respeitem o formato e forneçam energia esperada. A marca interna muda; o uso do controle não.

Isso é diferente de apenas “ter o mesmo nome de método”. Uma classe só respeita Liskov se também mantém as expectativas do contrato. Uma estratégia que lançasse erro para todo subtotal, por exemplo, não seria uma substituta útil para as demais.

### Exemplo no repositório

O serviço seleciona uma estratégia e usa somente a operação prevista pelo contrato:

Arquivo: `src/after/services/OrderService.ts`

```ts
const strategy = this.shippingStrategies[shippingType.toLowerCase()];

if (!strategy) {
  throw new Error(`Tipo de frete '${shippingType}' não é válido.`);
}

const shippingCost = strategy.calculate(subtotal);
```

`NormalShipping`, `ExpressShipping` e `PickupShipping` podem ser usadas nesse ponto porque todas implementam `IShippingStrategy`.

O mesmo acontece com pagamento. Tanto `PixGateway` quanto `CreditCardGateway` cumprem o contrato abaixo:

Arquivo: `src/after/factories/IPaymentGateway.ts`

```ts
export interface IPaymentGateway {
  processPayment(amount: number): Promise<{
    success: boolean;
    transactionId: string;
  }>;
}
```

### Vantagens

- É possível trocar implementações sem alterar o código consumidor.
- Reduz condicionais baseadas em classes concretas.
- Contratos tornam o comportamento esperado mais explícito.

### Desvantagens e cuidados

- Uma interface, sozinha, não garante substituição correta; as implementações precisam cumprir o combinado.
- Contratos vagos ou retornos inconsistentes podem causar falhas difíceis de perceber.
- Testes de contrato são úteis quando há várias implementações.

---

## I — Interface Segregation Principle (Segregação de Interfaces)

### Fundamento

Uma classe não deve ser forçada a depender de métodos que não utiliza. Em vez de uma “superinterface” para tudo, é melhor ter contratos pequenos e focados.

### Analogia e comparação

Um canivete tem muitas ferramentas, mas alguém que precisa somente de uma chave de fenda prefere usar uma chave de fenda simples. Uma interface grande obriga implementações a carregar ferramentas que não precisam.

Compare os contratos do projeto com uma interface genérica como esta:

```ts
// Exemplo a evitar: mistura responsabilidades sem relação.
interface SistemaDePedidos {
  calculateShipping(): number;
  processPayment(): Promise<void>;
  sendNotification(): Promise<void>;
  saveOrder(): Promise<void>;
}
```

Um gateway de pagamento teria de conhecer frete, notificação e banco, embora não faça nada disso.

### Exemplo no repositório

O contrato de rastreio contém apenas o que o serviço precisa para despachar o rastreio:

Arquivo: `src/after/adapters/ITrackingService.ts`

```ts
export interface ITrackingService {
  dispatchTracking(orderId: number, customerName: string): Promise<void>;
}
```

Outros exemplos igualmente focados são:

- `IShippingStrategy`: calcula frete;
- `IPaymentGateway`: processa pagamento;
- `IOrderObserver`: reage a mudanças do pedido;
- `INotificationProvider`: envia uma mensagem.

### Vantagens

- Implementações dependem somente do necessário.
- Mocks e testes ficam mais curtos.
- Mudanças em uma capacidade afetam menos classes.

### Desvantagens e cuidados

- Muitos contratos pequenos podem dificultar a descoberta do que existe no projeto.
- Interfaces devem representar necessidades reais dos consumidores, não ser divididas apenas por estética.
- `IOrderRepository` ainda reúne consulta de produto e gravação de pedidos. Para a proposta didática atual isso é aceitável; se consumidores distintos usarem apenas uma parte dele, pode fazer sentido separar, por exemplo, `IProductRepository` e `IOrderWriterRepository`.

---

## D — Dependency Inversion Principle (Inversão de Dependência)

### Fundamento

Partes que contém regras importantes do sistema não devem depender diretamente de detalhes técnicos, como SQLite, uma API específica ou uma biblioteca. Tanto a regra quanto o detalhe devem depender de uma abstração.

### Analogia e comparação

Um aparelho ligado à tomada não precisa saber qual usina gerou a energia. Ele depende de um padrão de fornecimento; a usina é um detalhe substituível.

Sem esse princípio, `OrderService` criaria e usaria diretamente `SQLiteOrderRepository`. Assim, trocar SQLite por PostgreSQL obrigaria a modificar a regra de negócio. Com a inversão, o serviço conhece apenas o acordo de persistência.

### Exemplo no repositório

O serviço recebe uma abstração no construtor:

Arquivo: `src/after/services/OrderService.ts`

```ts
export class OrderService {
  private orderRepository: IOrderRepository;

  constructor(orderRepository: IOrderRepository) {
    this.orderRepository = orderRepository;
  }
}
```

O acordo é definido separadamente:

Arquivo: `src/after/repositories/IOrderRepository.ts`

```ts
export interface IOrderRepository {
  findProductById(id: number): Promise<any>;
  saveOrder(order: /* dados do pedido */): Promise<number>;
  saveOrderItem(orderId: number, item: /* dados do item */): Promise<void>;
}
```

E o detalhe técnico implementa esse acordo:

Arquivo: `src/after/repositories/SQLiteOrderRepository.ts`

```ts
export class SQLiteOrderRepository implements IOrderRepository {
  public findProductById(id: number): Promise<any> {
    // consulta SQLite
  }
}
```

Essa mesma direção aparece em `ITrackingService`, `IPaymentGateway`, `IShippingStrategy` e `INotificationProvider`.

### Vantagens

- Trocar infraestrutura é mais simples e localizado.
- A regra de negócio pode ser testada com repositórios em memória ou falsos.
- Menos acoplamento a banco de dados, fornecedores e bibliotecas.

### Desvantagens e cuidados

- Exige criar e manter abstrações.
- Uma abstração ruim pode esconder detalhes importantes ou ficar difícil de entender.
- O projeto ainda instancia `SQLiteOrderRepository` dentro de `CheckoutFacade`; para uma aplicação maior, um contêiner de injeção de dependência ou uma camada de composição deixaria essa escolha ainda mais externa.

---

## Como os princípios trabalham juntos

O fluxo abaixo resume a colaboração entre as partes:

```text
Requisição HTTP
  → OrderController (entrada HTTP — SRP)
  → CheckoutFacade (simplifica o fluxo — SRP)
  → OrderService (regra de negócio)
      → IOrderRepository → SQLiteOrderRepository (DIP)
      → IShippingStrategy → Normal/Express/Pickup (OCP e LSP)
      → IPaymentGateway → Pix/CreditCard (ISP, DIP e LSP)
```

SOLID não exige o uso de todos os padrões de projeto presentes no repositório, mas eles ajudam a colocar os princípios em prática. Por exemplo, Strategy apoia OCP e LSP; Repository apoia SRP e DIP; Adapter e Bridge evitam que detalhes de integrações vazem para a regra de negócio.

## Resumo

| Princípio | Pergunta prática | Exemplo principal |
| --- | --- | --- |
| **S — SRP** | Esta classe tem um papel claro? | `OrderController`, `OrderService` e `SQLiteOrderRepository` separados. |
| **O — OCP** | Posso adicionar uma regra sem reescrever o fluxo estável? | Novas estratégias de frete e decorators. |
| **L — LSP** | Posso trocar uma implementação por outra sem quebrar o uso? | `PixGateway`/`CreditCardGateway` e estratégias de frete. |
| **I — ISP** | Esta interface contém somente o que seu consumidor usa? | `ITrackingService`, `IOrderObserver` e `IPaymentGateway`. |
| **D — DIP** | A regra depende de um contrato, e não de um detalhe técnico? | `OrderService` recebe `IOrderRepository`. |

O objetivo final não é “usar SOLID por usar”. É fazer com que uma mudança, como adicionar um novo frete ou substituir o banco, tenha um lugar previsível para acontecer e afete o menor número possível de partes da API.
