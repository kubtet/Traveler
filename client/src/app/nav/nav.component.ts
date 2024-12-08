import { Component, effect, inject, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { AccountService } from '../services/account.service';
import { UsersClient } from '../services/api';
import { firstValueFrom } from 'rxjs';
import { NavbarNotificationService } from '../services/navbar-notification.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MenubarModule, InputTextModule, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent implements OnInit {
  private usersClient = inject(UsersClient);
  private navbarNotificationService = inject(NavbarNotificationService);
  protected accountService = inject(AccountService);
  protected currentUserId: number = 0;
  protected items: MenuItem[] = [];
  protected loggedOutItems: MenuItem[] = [];
  protected currentUnreadThreads: number = 0;
  protected currentUnreadNotifications: number = 0;

  constructor() {
    effect(() => {
      if (
        this.currentUnreadThreads !==
        this.navbarNotificationService.messageNotifications()
      ) {
        this.setMenu();
        this.currentUnreadThreads =
          this.navbarNotificationService.messageNotifications();
      }

      if (
        this.currentUnreadNotifications !==
        this.navbarNotificationService.generalNotifications()
      ) {
        this.setMenu();
        this.currentUnreadNotifications =
          this.navbarNotificationService.generalNotifications();
      }
    });
  }

  public async ngOnInit() {
    const username = this.accountService.currentUser().username;
    const user = await firstValueFrom(
      this.usersClient.getUserByUsername(username)
    );
    this.currentUserId = user.id;

    await this.navbarNotificationService.getMessageNotifications();
    await this.navbarNotificationService.getGeneralNotifications();
    this.setMenu();
  }

  public async setMenu() {
    this.items = [
      {
        icon: 'pi pi-home',
        routerLink: '/',
      },
      {
        icon: 'pi pi-search',
        routerLink: 'search',
      },
      {
        icon: 'pi pi-plus',
        routerLink: 'travel/add',
      },
      {
        icon: 'pi pi-comment',
        routerLink: 'messages',
        badge:
          this.navbarNotificationService.messageNotifications() > 0
            ? this.navbarNotificationService.messageNotifications().toString()
            : null,
      },
      {
        icon: 'pi pi-bell',
        routerLink: 'notifications',
        badge:
          this.navbarNotificationService.generalNotifications() > 0
            ? this.navbarNotificationService.generalNotifications().toString()
            : null,
      },
      {
        icon: 'pi pi-hammer',
        routerLink: 'errors',
      },
      {
        icon: 'pi pi-user',
        routerLink: 'user-profile/' + this.currentUserId.toString(),
      },
      {
        icon: 'pi pi-lightbulb',
        routerLink: 'example',
      },
      {
        icon: 'pi pi-address-book',
        routerLink: 'admin',
        visible: this.accountService.roles().includes('Admin'),
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
