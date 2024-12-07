import {
  AfterViewChecked,
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
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
import { BehaviorSubject, debounceTime, firstValueFrom } from 'rxjs';
import { AppLoadingComponent } from '../shared/components/app-loading/app-loading.component';
import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { AppInputTextComponent } from '../shared/components/app-input-text/app-input-text.component';
import { AccountService } from '../services/account.service';
import { AppButtonComponent } from '../shared/components/app-button/app-button.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MessageService } from '../services/message.service';
import { NavbarNotificationService } from '../services/navbar-notification.service';

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
  providers: [MessageService],
})
export class MessagesComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messageScroll') threadView: ElementRef;
  private accountService = inject(AccountService);
  private navbarNotificationService = inject(NavbarNotificationService);
  private messageClient = inject(MessagesClient);
  private usersClient = inject(UsersClient);
  private router = inject(Router);
  protected messageService = inject(MessageService);
  protected isLoading = new BehaviorSubject(false);
  protected isLoadingThread = new BehaviorSubject(false);
  protected threads: MessageDto[] = [];
  protected user: MemberDto = new MemberDto();
  protected threadResponderPhotoUrl: BehaviorSubject<string> =
    new BehaviorSubject<string>('');
  protected threadResponderUsername: BehaviorSubject<string> =
    new BehaviorSubject<string>('');
  protected threadResponderId: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  protected newMessage: FormControl<string> = new FormControl<string>('');
  protected searchedUsername: FormControl<string> = new FormControl<string>('');
  protected listOfUsers: MemberDto[] = [];
  protected scrollTop: number = 0;
  protected previousScrollHeight: number = 0;
  protected currentUnreadThreads: number = 0;

  constructor() {
    effect(() => {
      this.navbarNotificationService.messageNotifications();
      if (
        this.currentUnreadThreads !==
        this.navbarNotificationService.messageNotifications()
      ) {
        this.loadAllThreads();
        this.currentUnreadThreads =
          this.navbarNotificationService.messageNotifications();
      }
    });
  }

  public async ngOnInit() {
    await this.loadComponent();
    this.searchedUsername.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.isLoading.next(true);
      this.loadUsers();
      this.isLoading.next(false);
    });
  }

  public ngAfterViewChecked() {
    const currentScrollHeight =
      this.threadView?.nativeElement?.scrollHeight || 0;

    if (currentScrollHeight !== this.previousScrollHeight) {
      this.previousScrollHeight = currentScrollHeight;

      setTimeout(() => {
        this.scrollTop = currentScrollHeight;
      }, 0);
    }
  }

  public async ngOnDestroy() {
    this.messageService.stopHubConnection();
    await this.navbarNotificationService.getMessageNotifications();
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
    this.messageService.stopHubConnection();
    this.loadAllThreads();

    const user = this.accountService.currentUser();
    if (!user) return;
    this.messageService.createHubConnection(user, responderId);

    const responder = await firstValueFrom(
      this.usersClient.getUserById(responderId)
    );

    this.threadResponderPhotoUrl.next(responder?.profilePhotoUrl);
    this.threadResponderUsername.next(responder?.username);
    this.threadResponderId.next(responder?.id);

    await this.navbarNotificationService.getMessageNotifications();

    this.scrollTop = this.threadView?.nativeElement?.scrollHeight;
    this.isLoadingThread.next(false);
  }

  protected async sendMessage() {
    const createMessage: CreateMessageDto = new CreateMessageDto({
      content: this.newMessage.value,
      recipientId: this.threadResponderId.value,
    });
    this.messageService.sendMessage(createMessage).then(() => {
      this.loadAllThreads(); // maybe unnecessary
      this.newMessage.setValue('');
      this.scrollTop = this.threadView.nativeElement?.scrollHeight;
    });
  }

  protected async beginNewThread(newResponder: MemberDto) {
    this.isLoadingThread.next(true);
    this.searchedUsername.setValue('');
    this.threadResponderPhotoUrl.next(newResponder.profilePhotoUrl);
    this.threadResponderUsername.next(newResponder.username);
    this.threadResponderId.next(newResponder.id);

    const user = this.accountService.currentUser();
    if (!user) return;
    this.messageService.createHubConnection(user, newResponder.id);

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
