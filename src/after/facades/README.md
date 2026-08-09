# Facade

## O que é e para que serve

O **Facade** oferece uma porta simples para um conjunto complexo de objetos. É como a recepção de um hotel: você pede o check-in a uma pessoa, sem precisar falar separadamente com limpeza, chaves e cobrança.

`CheckoutFacade` expõe `processCheckout` e `processReorder`. Ele esconde do controller a criação do repositório, do serviço e do comando.

## Quando usar

- Um fluxo envolve vários componentes e a maioria dos clientes só precisa de uma operação simples.
- Deseja proteger a camada de entrada de detalhes internos.
- Precisa definir uma API mais estável para um subsistema em evolução.

## Vantagens

- Reduz acoplamento e simplifica o uso do subsistema.
- Oferece uma entrada clara para fluxos importantes.
- Não impede clientes avançados de usar componentes internos quando necessário.

## Desvantagens

- Pode crescer e virar uma classe que sabe demais.
- Uma fachada ruim pode esconder recursos importantes ou introduzir dependências desnecessárias.

## Combinações úteis

- **Command:** a fachada pode encapsular uma ação complexa em um comando, como ocorre no checkout.
- **Factory:** a fachada pode escolher e criar colaboradores internos.
- **Adapter:** mantém integrações externas escondidas atrás do fluxo simples.
