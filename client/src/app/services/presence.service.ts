import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';
import { AddNotificationDto, UserDto } from './api';
import { NavbarNotificationService } from './navbar-notification.service';
import { MessageService } from 'primeng/api';

@Injectable()
export class PresenceService {
  private hubUrl = environment.hubsUrl;
  private hubConnection?: HubConnection;
  private navbarNotificationService = inject(NavbarNotificationService);
  private toastr = inject(MessageService);
  public onlineUsersIds = signal<number[]>([]);

  public createHubConnection(user: UserDto) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((error) => console.log(error));

    this.hubConnection.on('UserIsOnline', (userId) => {
      this.onlineUsersIds.update((ids) => [...ids, userId]);
    });

    this.hubConnection.on('UserIsOffline', (userId) => {
      this.onlineUsersIds.update((ids) => [...ids, userId]);
    });

    this.hubConnection.on('GetOnlineUsersIds', (ids) => {
      this.onlineUsersIds.set(ids);
    });

    this.hubConnection.on('NewMessageReceived', async (username: string) => {
      await this.navbarNotificationService.getMessageNotifications();
      this.toastr.add({
        severity: 'info',
        summary: 'Notification',
        detail: username + ' has sent you a message.',
        life: 10000,
      });
    });

    this.hubConnection.on('NewNotificationReceived', async (notification) => {
      await this.navbarNotificationService.getGeneralNotifications();
      this.toastr.add({
        severity: 'info',
        summary: 'Notification',
        detail: notification?.content,
        life: 10000,
      });
    });
  }

  public stopHubConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch((error) => console.log(error));
    }
  }

  public addNotification(addNotificationDto: AddNotificationDto) {
    return this.hubConnection?.invoke('AddNotification', addNotificationDto);
  }
}
