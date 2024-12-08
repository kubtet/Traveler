import { Component, inject, OnInit } from '@angular/core';
import {
  NotificationClient,
  PaginatedResponseOfNotificationDto,
} from '../services/api';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { AsyncPipe, DatePipe } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { PaginatorModule } from 'primeng/paginator';

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
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit {
  private notificationClient = inject(NotificationClient);
  protected isLoading = new BehaviorSubject(false);
  protected pageNumber: number = 1;
  protected pageSize: number = 5;
  protected notifications: PaginatedResponseOfNotificationDto =
    new PaginatedResponseOfNotificationDto();

  public async ngOnInit() {
    await this.loadNotifications();
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

  protected async onPageChange(event: any) {
    this.pageNumber = event.page + 1;
    this.pageSize = event.rows;
    await this.loadNotifications();
  }
}
