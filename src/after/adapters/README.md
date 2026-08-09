# Adapter

## O que é e para que serve

O **Adapter** faz duas interfaces incompatíveis conversarem. É como um adaptador de tomada: o aparelho continua sendo o mesmo, mas agora pode ser ligado em uma tomada diferente.

Aqui, `TrackingAdapter` oferece ao restante da aplicação o método simples `dispatchTracking`. Por dentro, ele transforma os dados em XML e chama `LegacyTrackingApi`, uma API antiga que fala outra “língua”.

## Quando usar

- Integrar uma biblioteca, API de parceiro ou sistema legado sem espalhar seus detalhes pelo projeto.
- Trocar um fornecedor mantendo a interface que o sistema já conhece.
- Isolar conversões de formato, como JSON para XML.

## Vantagens

- Protege o código de negócio de detalhes externos.
- Centraliza a conversão e facilita testes.
- Permite trocar a integração com menor impacto.

## Desvantagens

- Cria uma camada e uma classe a mais.
- Pode esconder limitações importantes do sistema adaptado, como campos ou erros que não têm equivalente.

## Combinações úteis

- **Facade:** a fachada pode expor um fluxo simples que usa vários adapters internamente.
- **Factory:** escolhe qual adapter usar para cada fornecedor.
- **Repository:** adapta uma fonte de dados externa à interface de persistência da aplicação.
