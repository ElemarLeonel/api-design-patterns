# Bridge

## O que é e para que serve

O **Bridge** separa duas coisas que podem variar de modo independente. Pense em uma lâmpada: o interruptor é a forma de controlar, enquanto a lâmpada é o equipamento que executa; um pode mudar sem obrigar a trocar o outro.

Neste código, `NotificationChannel` define o canal (e-mail ou SMS) e `INotificationProvider` define quem entrega a mensagem (SendGrid ou Twilio). Assim, um novo canal não exige reescrever os provedores, e vice-versa.

## Quando usar

- Há duas dimensões de variação, como tipo de notificação e fornecedor.
- Combinar subclasses para cada possibilidade criaria muitas classes.
- Deseja trocar implementações em tempo de execução.

## Vantagens

- Evita a explosão de combinações de subclasses.
- Cada lado evolui e é testado separadamente.
- Facilita adicionar canais e provedores.

## Desvantagens

- A estrutura inicial é mais abstrata para casos pequenos.
- Exige decidir bem onde termina o canal e onde começa o provedor.

## Combinações úteis

- **Observer:** observadores podem enviar avisos por canais conectados a provedores diferentes, como neste projeto.
- **Factory:** pode montar a combinação correta de canal e provedor.
- **Adapter:** adapta SDKs externos para a interface do provedor.
