import { computed, inject, Injectable, signal } from '@angular/core';
import { UserDto } from './api';
import { Router } from '@angular/router';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private router = inject(Router);
  private presenceService = inject(PresenceService);
  public expirationDate = computed(() => {
    const user = this.currentUser();
    if (user && user.token) {
      const expirationDate = JSON.parse(atob(user.token.split('.')[1])).exp;
      if (expirationDate !== null) {
        return expirationDate;
      }
    }
    return null;
  });
  public roles = computed(() => {
    const user = this.currentUser();
    if (user && user.token) {
      const role = JSON.parse(atob(user.token.split('.')[1])).role;
      return Array.isArray(role) ? role : [role];
    }
    return [];
  });
  public currentUser = signal<UserDto>(undefined);

  public setUser(user: UserDto) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
    this.presenceService.createHubConnection(user);
  }

  public logOut() {
    localStorage.removeItem('user');
    this.currentUser.set(undefined);
    this.router.navigateByUrl('/login');
    this.presenceService.stopHubConnection();
  }
}
