# Singleton

## O que é e para que serve

O **Singleton** garante uma única instância compartilhada e oferece um ponto de acesso a ela. É como a central elétrica do prédio: todos usam a mesma central, em vez de cada apartamento instalar outra.

`DatabaseConnection` cria a conexão SQLite somente na primeira chamada a `getInstance`; as chamadas seguintes reutilizam a mesma conexão.

## Quando usar

- Há um recurso realmente compartilhado, como uma configuração imutável ou uma conexão controlada.
- A criação é cara e uma única instância é adequada ao processo.

## Vantagens

- Evita inicializações repetidas.
- Centraliza o ciclo de vida do recurso.
- Oferece acesso simples e consistente.

## Desvantagens

- É estado global disfarçado e pode dificultar testes.
- Pode causar problemas de concorrência, reinicialização ou conexões demais em sistemas maiores.
- Nem todo banco deve usar uma única conexão; normalmente usa-se um pool.

## Combinações úteis

- **Repository:** repositórios podem obter uma conexão compartilhada, como `SQLiteOrderRepository` faz.
- **Factory:** uma fábrica pode controlar a criação de recursos caros.
- **Dependency Injection:** é uma alternativa geralmente mais testável para fornecer a instância.
