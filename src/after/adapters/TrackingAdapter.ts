import { ITrackingService } from './ITrackingService';
import { LegacyTrackingApi } from './LegacyTrackingApi';

// O Adapter "adapta" a API legada para se comportar como a nossa interface limpa
export class TrackingAdapter implements ITrackingService {
  private legacyApi: LegacyTrackingApi;

  constructor() {
    this.legacyApi = new LegacyTrackingApi();
  }

  public async dispatchTracking(orderId: number, customerName: string): Promise<void> {
    // Formatação de XML e adaptação escondida aqui dentro! O resto do sistema não precisa ver XML.
    const xml = `<rastreio><pedido>${orderId}</pedido><nome>${customerName}</nome></rastreio>`;
    this.legacyApi.enviarRastreioCorreios(xml);
    console.log(`[Adapter] Chamada adaptada e enviada via XML para o sistema legado com sucesso.`);
  }
}
