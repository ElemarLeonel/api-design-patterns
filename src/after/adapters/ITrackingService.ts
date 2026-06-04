// Interface limpa que nossa aplicação vai usar, independente de quem realiza o rastreio
export interface ITrackingService {
  dispatchTracking(orderId: number, customerName: string): Promise<void>;
}
