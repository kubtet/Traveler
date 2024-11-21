import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PaginatedResponseOfMemberDto, UsersClient } from '../services/api';
import { BehaviorSubject, debounceTime, firstValueFrom, pipe } from 'rxjs';
import { AppLoadingComponent } from '../shared/components/app-loading/app-loading.component';
import { AsyncPipe } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { AppInputTextComponent } from '../shared/components/app-input-text/app-input-text.component';
import { AvatarModule } from 'primeng/avatar';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    AppLoadingComponent,
    AppInputTextComponent,
    AsyncPipe,
    AvatarModule,
    PaginatorModule,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  private router = inject(Router);
  private usersClient = inject(UsersClient);
  protected pageNumber: number = 1;
  protected pageSize: number = 15;
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
    console.log(userId);
    this.router.navigateByUrl('/user-profile/' + userId);
  }

  protected async onPageChange(event: any) {
    this.pageNumber = event.page + 1;
    this.pageSize = event.rows;
    await this.loadUsers();
  }
}
