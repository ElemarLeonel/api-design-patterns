# Iterator

## O que é e para que serve

O **Iterator** percorre uma coleção sem revelar como ela guarda os itens. É como usar o controle remoto para avançar músicas: você navega pela lista sem precisar abrir ou entender o aparelho.

`OrderItemsCollection` armazena itens e cria `OrderItemsIterator`. O serviço usa `hasNext` e `next` tanto para calcular o subtotal quanto para salvar os itens.

## Quando usar

- A coleção pode mudar sua estrutura interna, mas quem percorre não deve ser afetado.
- Quer uma forma padronizada de navegar por várias coleções.
- Precisa de percursos próprios, como filtros, paginação ou ordem inversa.

## Vantagens

- Separa a navegação do armazenamento.
- Permite mais de um percurso independente pela mesma coleção.
- Simplifica a criação de diferentes formas de percorrer dados.

## Desvantagens

- Em linguagens com iteradores nativos, uma implementação manual pode ser redundante.
- Exige atenção se a coleção mudar durante a iteração.

## Combinações úteis

- **Composite:** um iterador pode percorrer uma árvore de objetos compostos.
- **Visitor:** o visitor aplica uma operação a cada elemento percorrido.
- **Repository:** um repositório pode devolver coleções navegáveis sem expor a origem dos dados.
