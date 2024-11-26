import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { debounceTime, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AccountClient } from '../../services/api';

export function uniqueUsernameValidator(
  accountClient: AccountClient
): AsyncValidatorFn {
  return (
    control: AbstractControl
  ): Observable<{ [key: string]: any } | null> => {
    if (!control.value) {
      return of(null);
    }

    return accountClient.userExists(control.value).pipe(
      debounceTime(500),
      map((isTaken) => (isTaken ? { usernameTaken: true } : null)),
      catchError(() => of(null))
    );
  };
}
