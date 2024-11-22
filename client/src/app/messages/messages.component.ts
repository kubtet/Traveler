import {
  AfterViewChecked,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  CreateMessageDto,
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
import { AppButtonComponent } from '../shared/components/app-button/app-button.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    AsyncPipe,
    AppLoadingComponent,
    OverlayPanelModule,
    AppInputTextComponent,
    DatePipe,
    AppButtonComponent,
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
})
export class MessagesComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  private accountService = inject(AccountService);
  private messageClient = inject(MessagesClient);
  private usersClient = inject(UsersClient);
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

  public async ngOnInit() {
    await this.loadComponent();
  }

  public ngAfterViewChecked(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    }
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
