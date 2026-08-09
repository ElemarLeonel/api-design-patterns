# Builder

## O que é e para que serve

O **Builder** constrói objetos passo a passo. É como pedir um lanche: você escolhe pão, recheio e adicionais antes de receber o pedido pronto. Em vez de um construtor enorme com muitos parâmetros, o código monta o pedido com métodos legíveis.

`OrderBuilder` recebe subtotal, estratégia de frete, embrulho e seguro. No `build`, valida o frete e monta o pedido final, aplicando os extras necessários.

## Quando usar

- O objeto tem muitas opções, especialmente opções opcionais.
- A criação possui etapas ou validações.
- Quer uma chamada autoexplicativa e sem parâmetros posicionais confusos.

## Vantagens

- Deixa a criação mais fácil de ler e manter.
- Centraliza regras de montagem.
- Pode impedir objetos incompletos ou inválidos.

## Desvantagens

- Adiciona uma classe para objetos simples.
- Um builder reutilizado sem cuidado pode manter estado de uma montagem anterior.

## Combinações úteis

- **Decorator:** o builder pode aplicar adicionais durante a construção, como embrulho e seguro aqui.
- **Strategy:** recebe a regra de frete escolhida sem saber como ela calcula o valor.
- **Prototype:** pode reconstruir e clonar uma configuração já conhecida.
