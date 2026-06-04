// Simulando uma API legada de terceiros (ex: Correios antigo) que só aceita XML e usa nomes estranhos
export class LegacyTrackingApi {
  public enviarRastreioCorreios(xmlData: string): boolean {
    console.log(`[Legacy API] Processando XML de rastreio: ${xmlData}`);
    // Simula validação e envio do XML
    return true;
  }
}
