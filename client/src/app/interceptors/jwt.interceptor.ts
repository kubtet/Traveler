import { HttpInterceptorFn } from '@angular/common/http';
import { AccountService } from '../services/account.service';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);
  const toastr = inject(MessageService);

  const exp = accountService.expirationDate();
  const tokenExpirationDate = new Date(exp);
  const now = new Date();

  if (tokenExpirationDate > now) {
    accountService.logOut();
    toastr.add({
      severity: 'error',
      summary: 'Expired',
      detail: 'Your session has expired. Log in again',
    });
  }

  if (
    !req.url.match('https://www.primefaces.org/cdn/api/upload.php') &&
    accountService.currentUser()
  ) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accountService.currentUser()?.token}`,
      },
    });
  }
  return next(req);
};
