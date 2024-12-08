import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MessagesClient, NotificationClient } from './api';

@Injectable()
export class NavbarNotificationService {
  private notificationClient = inject(NotificationClient);
  private messagesClient = inject(MessagesClient);
  public messageNotifications = signal<number>(0);
  public generalNotifications = signal<number>(0);

  public async getMessageNotifications() {
    const unreadThreads = await firstValueFrom(
      this.messagesClient.getNumberOfUnreadThreads()
    );

    if (unreadThreads === null || unreadThreads === undefined) {
      return;
    }

    this.messageNotifications.set(unreadThreads);
  }

  public async getGeneralNotifications() {
    const unreadNotifications = await firstValueFrom(
      this.notificationClient.getUnreadNotificationsCount()
    );

    if (unreadNotifications === null || unreadNotifications === undefined) {
      return;
    }

    this.generalNotifications.set(unreadNotifications);
  }
}
