// Implementador da Bridge
export interface INotificationProvider {
  sendMessage(to: string, content: string): Promise<void>;
}
