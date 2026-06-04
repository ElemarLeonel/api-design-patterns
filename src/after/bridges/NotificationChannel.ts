import { INotificationProvider } from './INotificationProvider';

// Abstração da Bridge
export abstract class NotificationChannel {
  protected provider: INotificationProvider;

  constructor(provider: INotificationProvider) {
    this.provider = provider;
  }

  public abstract send(to: string, title: string, body: string): Promise<void>;
}
