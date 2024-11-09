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
        label: '',
        icon: 'pi pi-home',
        routerLink: '/',
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
        routerLink: '/user-profile',
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
