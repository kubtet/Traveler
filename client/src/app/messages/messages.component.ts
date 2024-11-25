import { Component, inject, OnInit } from '@angular/core';
import {
  CreateMessageDto,
  MemberDto,
  MessageDto,
  MessagesClient,
  UsersClient,
} from '../services/api';
import { BehaviorSubject, debounceTime, firstValueFrom } from 'rxjs';
import { AppLoadingComponent } from '../shared/components/app-loading/app-loading.component';
import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { AppInputTextComponent } from '../shared/components/app-input-text/app-input-text.component';
import { AccountService } from '../services/account.service';
import { AppButtonComponent } from '../shared/components/app-button/app-button.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    AsyncPipe,
    AppLoadingComponent,
    AppInputTextComponent,
    DatePipe,
    AppButtonComponent,
    NgClass,
    AutoCompleteModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
})
export class MessagesComponent implements OnInit {
  private accountService = inject(AccountService);
  private messageClient = inject(MessagesClient);
  private usersClient = inject(UsersClient);
  private router = inject(Router);
  protected isLoading = new BehaviorSubject(false);
  protected isLoadingThread = new BehaviorSubject(false);
  protected threads: MessageDto[] = [];
  protected user: MemberDto = new MemberDto();
  protected currentThread: BehaviorSubject<MessageDto[]> = new BehaviorSubject<
    MessageDto[]
  >([]);
  protected threadResponderPhotoUrl: BehaviorSubject<string> =
    new BehaviorSubject<string>('');
  protected threadResponderUsername: BehaviorSubject<string> =
    new BehaviorSubject<string>('');
  protected threadResponderId: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  protected newMessage: FormControl<string> = new FormControl<string>('');
  protected searchedUsername: FormControl<string> = new FormControl<string>('');
  protected listOfUsers: MemberDto[] = [];

  public async ngOnInit() {
    await this.loadComponent();
    this.searchedUsername.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.isLoading.next(true);
      this.loadUsers();
      this.isLoading.next(false);
    });
  }

  protected async loadComponent() {
    this.isLoading.next(true);

    const user = await firstValueFrom(
      this.usersClient.getUserByUsername(
        this.accountService.currentUser().username
      )
    );

    if (user !== null && user !== undefined) {
      this.user = user;
    }

    this.loadAllThreads();
    this.isLoading.next(false);
  }

  protected async loadAllThreads() {
    const messageThreads = await firstValueFrom(
      this.messageClient.getAllMessageThreads()
    );

    if (messageThreads !== null && messageThreads.length !== 0) {
      this.threads = messageThreads;

      messageThreads[0].senderId === this.user.id
        ? this.loadThread(messageThreads[0].recipientId)
        : this.loadThread(messageThreads[0].senderId);
    }
  }

  protected async loadThread(
    responderId: number,
    refreshFlag: boolean = false
  ) {
    if (this.threadResponderId.value === responderId && !refreshFlag) {
      return;
    }
    this.isLoadingThread.next(true);
    const result = await firstValueFrom(
      this.messageClient.getMessageThread(responderId)
    );

    this.currentThread.next(result);

    const message = this.currentThread.value[0];
    if (message.recipientId === this.user.id) {
      this.threadResponderPhotoUrl.next(message.senderPhotoUrl);
      this.threadResponderUsername.next(message.senderUsername);
      this.threadResponderId.next(message.senderId);
    } else {
      this.threadResponderPhotoUrl.next(message.recipientPhotoUrl);
      this.threadResponderUsername.next(message.recipientUsername);
      this.threadResponderId.next(message.recipientId);
    }

    this.isLoadingThread.next(false);
  }

  protected async sendMessage() {
    const createMessage: CreateMessageDto = new CreateMessageDto({
      content: this.newMessage.value,
      recipientId: this.threadResponderId.value,
    });
    const result = await firstValueFrom(
      this.messageClient.createMessage(createMessage)
    );
    if (result) {
      this.loadThread(this.threadResponderId.value, true);
      this.loadAllThreads();
      this.newMessage.setValue('');
    }
  }

  protected async beginNewThread(newResponder: MemberDto) {
    this.isLoadingThread.next(true);
    this.searchedUsername.setValue('');
    this.threadResponderPhotoUrl.next(newResponder.profilePhotoUrl);
    this.threadResponderUsername.next(newResponder.username);
    this.threadResponderId.next(newResponder.id);

    const result = await firstValueFrom(
      this.messageClient.getMessageThread(newResponder.id)
    );

    this.currentThread.next(result);
    this.isLoadingThread.next(false);
  }

  protected async loadUsers() {
    this.isLoading.next(true);
    const listOfUsers = await firstValueFrom(
      this.usersClient.getUsers(this.searchedUsername.value)
    );
    this.listOfUsers = listOfUsers.items;
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

  protected navigateToUserProfile(userId: number) {
    this.router.navigateByUrl('/user-profile/' + userId);
  }
}
