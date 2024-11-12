import { Component, inject, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { AccountService } from '../services/account.service';
import { UsersClient } from '../services/api';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MenubarModule, InputTextModule, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent implements OnInit {
  private usersClient = inject(UsersClient);
  protected accountService = inject(AccountService);
  protected currentUserId: number = 0;
  protected items: MenuItem[] = [];
  protected loggedOutItems: MenuItem[] = [];

  public async ngOnInit() {
    const username = this.accountService.currentUser().username;
    const user = await firstValueFrom(
      this.usersClient.getUserByUsername(username)
    );
    this.currentUserId = user.id;

    this.items = [
      {
        label: '',
        icon: 'pi pi-home',
        routerLink: '/',
      },
      {
        label: '',
        icon: 'pi pi-search',
        routerLink: '/search',
      },
      {
        label: '',
        icon: 'pi pi-plus',
        tooltip: 'Add new gallery',
        routerLink: 'travel/add',
      },

      {
        label: '',
        icon: 'pi pi-comment',
        tooltip: 'Chats',
      },
      {
        label: '',
        icon: 'pi pi-bell',
        tooltip: 'Notifications',
      },
      {
        label: '',
        icon: 'pi pi-hammer',
        tooltip: 'Errors',
        routerLink: '/errors',
      },
      {
        label: '',
        icon: 'pi pi-user',
        routerLink: '/user-profile/' + this.currentUserId.toString(),
      },
      {
        label: '',
        icon: 'pi pi-lightbulb',
        routerLink: '/example',
      },
    ];

    this.loggedOutItems = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: '/',
      },
    ];
  }
}
