import { computed, inject, Injectable, signal } from '@angular/core';
import { UserDto } from './api';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private router = inject(Router);
  public roles = computed(() => {
    const user = this.currentUser();
    if (user && user.token) {
      const role = JSON.parse(atob(user.token.split('.')[1])).role;
      return Array.isArray(role) ? role : [role];
    }
    return [];
  });
  public currentUser = signal<UserDto>(undefined);

  constructor() {}

  public setUser(user: UserDto) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
  }

  public logOut() {
    localStorage.removeItem('user');
    this.currentUser.set(undefined);
    this.router.navigateByUrl('/login');
  }
}
