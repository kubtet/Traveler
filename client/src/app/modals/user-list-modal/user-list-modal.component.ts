import { Component, OnInit, inject, input } from '@angular/core';
import { MemberDto } from '../../services/api';
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-user-list-modal',
  standalone: true,
  imports: [AvatarModule],
  templateUrl: './user-list-modal.component.html',
  styleUrl: './user-list-modal.component.css',
})
export class UserListModalComponent implements OnInit {
  private router = inject(Router);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  protected usersToDisplay: MemberDto[] = [];

  ngOnInit(): void {
    const users = this.config.data?.usersToDisplay;
    if (users) {
      this.usersToDisplay = users;
    }
  }

  goToUserProfile(selectedUserId: number) {
    this.ref.close();
    this.router.navigateByUrl(`user-profile/${selectedUserId}`);
  }
}
