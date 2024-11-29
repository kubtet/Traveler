import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { MessageService } from 'primeng/api';

export const adminGuard: CanActivateFn = () => {
  const accountService = inject(AccountService);
  const toastr = inject(MessageService);
  const router = inject(Router);

  if (accountService.roles().includes('Admin')) {
    return true;
  } else {
    toastr.add({
      severity: 'error',
      summary: 'Forbidden',
      detail: 'You cannot enter this area',
    });
    router.navigateByUrl('/');
    return false;
  }
};
