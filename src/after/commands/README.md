# Command

## O que é e para que serve

O **Command** transforma uma solicitação em objeto. É parecido com uma comanda de restaurante: ela registra o que deve ser feito e o garçom não precisa cozinhar o prato.

`PlaceOrderCommand` guarda os dados e o serviço responsável. Ao executar `execute`, delega o processamento para `OrderService`.

## Quando usar

- Enfileirar, registrar, repetir ou agendar ações.
- Separar quem pede uma operação de quem realmente a executa.
- Implementar desfazer/refazer, auditoria ou tentativas automáticas.

## Vantagens

- Desacopla o disparo da ação de sua execução.
- Facilita filas, logs e testes de operações.
- Dá uma interface uniforme para comandos distintos.

## Desvantagens

- Para ações muito pequenas pode parecer uma camada desnecessária.
- Muitos comandos podem aumentar a quantidade de classes.

## Combinações úteis

- **Facade:** a fachada pode criar e executar comandos, como no checkout.
- **Observer:** um comando concluído pode notificar interessados.
- **Memento:** guarda o estado necessário para desfazer um comando.
