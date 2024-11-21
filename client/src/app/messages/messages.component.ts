import { Component, inject, OnInit } from '@angular/core';
import {
  MemberDto,
  MessageDto,
  MessagesClient,
  UsersClient,
} from '../services/api';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AppLoadingComponent } from '../shared/components/app-loading/app-loading.component';
import { AsyncPipe, DatePipe } from '@angular/common';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AppInputTextComponent } from '../shared/components/app-input-text/app-input-text.component';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    AsyncPipe,
    AppLoadingComponent,
    OverlayPanelModule,
    AppInputTextComponent,
    DatePipe,
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
})
export class MessagesComponent implements OnInit {
  private accountService = inject(AccountService);
  private messageClient = inject(MessagesClient);
  private usersClient = inject(UsersClient);
  protected isLoading = new BehaviorSubject(false);
  protected threads: MessageDto[] = [];
  protected user: MemberDto = new MemberDto();

  public async ngOnInit() {
    await this.loadMessages();
  }

  protected async loadMessages() {
    this.isLoading.next(true);

    const user = await firstValueFrom(
      this.usersClient.getUserByUsername(
        this.accountService.currentUser().username
      )
    );

    if (user !== null && user !== undefined) {
      this.user = user;
    }

    const messageThreads = await firstValueFrom(
      this.messageClient.getAllMessageThreads()
    );

    if (messageThreads !== null) {
      this.threads = messageThreads;
    }

    this.isLoading.next(false);
  }

  protected isToday(date: Date): boolean {
    const today = new Date();
    const messageDate = new Date(date);

    return (
      today.getDate() === messageDate.getDate() &&
      today.getMonth() === messageDate.getMonth() &&
      today.getFullYear() === messageDate.getFullYear()
    );
  }
}
