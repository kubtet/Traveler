import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PaginatedResponseOfMemberDto, UsersClient } from '../services/api';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AppLoadingComponent } from '../shared/components/app-loading/app-loading.component';
import { AsyncPipe } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [AppLoadingComponent, AsyncPipe, PaginatorModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  private router = inject(Router);
  private usersClient = inject(UsersClient);
  protected pageNumber: number = 1;
  protected pageSize: number = 15;
  protected isLoading = new BehaviorSubject(false);
  protected users: PaginatedResponseOfMemberDto =
    new PaginatedResponseOfMemberDto();

  public async ngOnInit() {
    await this.loadUsers();
  }

  protected async loadUsers() {
    this.isLoading.next(true);
    const listOfUsers = await firstValueFrom(
      this.usersClient.getUsers(this.pageNumber, this.pageSize)
    );
    if (listOfUsers?.items?.length > 0) {
      this.users = listOfUsers;
    }
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
