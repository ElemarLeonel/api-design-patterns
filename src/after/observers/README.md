# Observer

## O que é e para que serve

O **Observer** avisa automaticamente os interessados quando algo acontece. É como assinar alertas de uma loja: quando o pedido muda de status, todos os canais cadastrados recebem a novidade.

`OrderSubject` mantém ouvintes. Os listeners de e-mail e SMS implementam `IOrderObserver` e são chamados quando o pedido é atualizado.

## Quando usar

- Um evento deve desencadear ações de vários interessados.
- Não quer que o objeto principal conheça detalhes de notificação, métricas ou auditoria.
- Os interessados podem entrar ou sair dinamicamente.

## Vantagens

- Baixo acoplamento entre quem publica e quem reage.
- Novas reações são adicionadas sem alterar o publicador.
- É natural para notificações e arquitetura orientada a eventos.

## Desvantagens

- A ordem e o momento das notificações podem ficar difíceis de prever.
- Falhas e desempenho de observadores precisam ser tratados.
- Muitos observadores podem tornar o fluxo menos visível.

## Combinações úteis

- **Bridge:** cada observador pode usar um canal e provedor de notificação intercambiáveis, como neste código.
- **Command:** eventos podem disparar comandos assíncronos.
- **Mediator:** centraliza regras quando os observadores passam a interagir demais entre si.
