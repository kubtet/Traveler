import { HttpInterceptorFn } from '@angular/common/http';
import { AccountService } from '../services/account.service';
import { inject } from '@angular/core';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);

  const exp = accountService.expirationDate();
  const now: number = Math.floor(Date.now() / 1000);

  if (now > exp) {
    accountService.logOut();
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
