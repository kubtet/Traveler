import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  NotificationClient,
  PaginatedResponseOfNotificationDto,
} from '../../api';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { AsyncPipe, DatePipe } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { PaginatorModule } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { NavbarNotificationService } from '../services/navbar-notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    AsyncPipe,
    AvatarModule,
    CardModule,
    DatePipe,
    PaginatorModule,
    TableModule,
    TagModule,
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private navbarNotificationService = inject(NavbarNotificationService);
  private notificationClient = inject(NotificationClient);
  private router = inject(Router);
  protected isLoading = new BehaviorSubject(false);
  protected pageNumber: number = 1;
  protected pageSize: number = 5;
  protected notifications: PaginatedResponseOfNotificationDto =
    new PaginatedResponseOfNotificationDto();

  public async ngOnInit() {
    await this.loadNotifications();
  }

  public async ngOnDestroy() {
    await this.navbarNotificationService.getGeneralNotifications();
  }

  protected async loadNotifications() {
    this.isLoading.next(true);
    const listOfNotifications = await firstValueFrom(
      this.notificationClient.getNotificationsForUser(
        0,
        this.pageNumber,
        this.pageSize
      )
    );
    this.notifications = listOfNotifications;
    this.isLoading.next(false);
  }

  protected navigateToUserProfile(userId: number) {
    this.router.navigateByUrl('/user-profile/' + userId);
  }

  protected async onPageChange(event: any) {
    this.pageNumber = event.page + 1;
    this.pageSize = event.rows;
    await this.loadNotifications();
  }
}
