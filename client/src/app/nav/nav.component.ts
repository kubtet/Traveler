import { Component, inject, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { AppButtonComponent } from '../shared/components/app-button/app-button.component';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MenubarModule, AppButtonComponent, InputTextModule, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent implements OnInit {
  protected accountService = inject(AccountService);
  protected items: MenuItem[] = [];
  protected loggedOutItems: MenuItem[] = [];

  public ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: '/',
      },
      {
        label: 'Your travelboard',
        icon: 'pi pi-map',
      },
      {
        label: 'Chats',
        icon: 'pi pi-comment',
      },
      {
        label: 'Profile',
        icon: 'pi pi-user',
        items: [
          {
            label: 'Edit profile',
            icon: 'pi pi-cog',
          },
          {
            label: 'Contact',
            icon: 'pi pi-envelope',
          },
          {
            label: 'Log out',
            icon: 'pi pi-sign-out',
            command: () => this.accountService.logOut(),
          },
        ],
      },
      {
        label: 'Example',
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
