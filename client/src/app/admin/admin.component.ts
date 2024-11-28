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
import { AppInputTextComponent } from "../shared/components/app-input-text/app-input-text.component";

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
    AppInputTextComponent
],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
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
}
