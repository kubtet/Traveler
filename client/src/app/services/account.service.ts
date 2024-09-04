import { inject, Injectable, signal } from '@angular/core';
import { UserDto } from './api';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private router = inject(Router);
  public currentUser = signal<UserDto>(undefined);

  constructor() {}

  public setUser(user: UserDto) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
    this.router.navigateByUrl('/');
  }

  public logOut() {
    localStorage.removeItem('user');
    this.currentUser.set(undefined);
    this.router.navigateByUrl('/login');
  }
}
