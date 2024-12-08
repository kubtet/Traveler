import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MessagesClient } from './api';

@Injectable()
export class NavbarNotificationService {
  private messagesClient = inject(MessagesClient);
  public messageNotifications = signal<number>(0);

  public async getMessageNotifications() {
    const unreadThreads = await firstValueFrom(
      this.messagesClient.getNumberOfUnreadThreads()
    );

    if (unreadThreads === null || unreadThreads === undefined) {
      return;
    }

    this.messageNotifications.set(unreadThreads);
  }
}
