import { Component, inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { BehaviorSubject, debounceTime, firstValueFrom } from 'rxjs';
import { UsersClient, PaginatedResponseOfMemberDto } from '../services/api';
import { AsyncPipe, DatePipe } from '@angular/common';
import { AppButtonComponent } from '../shared/components/app-button/app-button.component';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { AppInputTextComponent } from '../shared/components/app-input-text/app-input-text.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    AvatarModule,
    AsyncPipe,
    AppButtonComponent,
    CardModule,
    DatePipe,
    PaginatorModule,
    TableModule,
    AppInputTextComponent,
    ConfirmDialogModule,
    ToastModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  providers: [ConfirmationService, MessageService],
})
export class AdminComponent implements OnInit {
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private usersClient = inject(UsersClient);
  protected pageNumber: number = 1;
  protected pageSize: number = 5;
  protected searchedUsername: FormControl<string> = new FormControl<string>('');
  protected isLoading = new BehaviorSubject(false);
  protected users: PaginatedResponseOfMemberDto =
    new PaginatedResponseOfMemberDto();

  public async ngOnInit() {
    await this.loadUsers();
    this.searchedUsername.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.isLoading.next(true);
      this.loadUsers();
      this.isLoading.next(false);
    });
  }

  protected async loadUsers() {
    this.isLoading.next(true);
    const listOfUsers = await firstValueFrom(
      this.usersClient.getUsers(
        this.searchedUsername.value,
        null,
        null,
        this.pageNumber,
        this.pageSize
      )
    );
    this.users = listOfUsers;
    this.isLoading.next(false);
  }

  protected navigateToUserProfile(userId: number) {
    this.router.navigateByUrl('/user-profile/' + userId);
  }

  protected async onPageChange(event: any) {
    this.pageNumber = event.page + 1;
    this.pageSize = event.rows;
    await this.loadUsers();
  }

  protected async removeUser(id: number) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this user permanently?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: async () => {
        this.isLoading.next(true);
        await firstValueFrom(this.usersClient.deleteUser(id));
        await this.loadUsers();
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'User deleted',
        });
        this.isLoading.next(false);
      },
    });
  }
}
