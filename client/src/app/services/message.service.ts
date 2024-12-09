import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';
import { CreateMessageDto, MessageDto, UserDto } from '../../api';
import { Group } from '../models/group';

@Injectable()
export class MessageService {
  private hubUrl = environment.hubsUrl;
  private hubConnection?: HubConnection;
  public messageThread = signal<MessageDto[]>([]);

  public createHubConnection(user: UserDto, otherUserId: number) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'messages?user=' + otherUserId, {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((error) => console.log(error));

    this.hubConnection.on('ReceiveMessageThread', (messages) => {
      this.messageThread.set(messages);
    });

    this.hubConnection.on('NewMessage', (message) => {
      this.messageThread.update((messages) => [...messages, message]);
    });

    this.hubConnection.on('UpdatedGroup', (group: Group) => {
      if (group.connections.some((c) => c.userId == otherUserId.toString())) {
        this.messageThread.update((messages) => {
          messages.forEach((message) => {
            if (!message.dateRead) {
              message.dateRead = new Date(Date.now());
            }
          });
          return messages;
        });
      }
    });
  }

  public stopHubConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch((error) => console.log(error));
    }
  }

  public async sendMessage(createMessageDto: CreateMessageDto) {
    return this.hubConnection?.invoke('SendMessage', createMessageDto);
  }
}
