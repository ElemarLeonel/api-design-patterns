# Controller (MVC)

## O que é e para que serve

O **Controller** recebe a requisição da interface e coordena a resposta; ele funciona como o atendente de uma loja. O atendente confere o pedido, encaminha-o ao setor certo e devolve o resultado, mas não fabrica nem entrega o produto.

`OrderController` valida os campos HTTP, chama `CheckoutFacade` e converte sucesso ou falha em respostas HTTP.

## Quando usar

- Criar endpoints HTTP, ações web ou handlers de interface.
- Manter detalhes de transporte separados das regras de negócio.

## Vantagens

- Deixa a API organizada por ações e recursos.
- Evita que regras de negócio dependam de `Request` e `Response`.
- Simplifica testes do fluxo HTTP.

## Desvantagens

- Pode virar um “controller gordo” se passar a concentrar regras de negócio.
- É outra camada para aplicações muito pequenas.

## Combinações úteis

- **Facade:** oferece ao controller uma entrada simples para um fluxo complexo, como neste exemplo.
- **Command:** representa ações recebidas pelo controller.
- **Service Layer:** guarda o trabalho de negócio que o controller não deve executar.
