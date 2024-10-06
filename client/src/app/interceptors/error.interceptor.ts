import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, Observable } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(MessageService);

  return next(req).pipe(
    catchError((error) => {
      if (error) {
        switch (error.status) {
          case 400:
            if (error.error instanceof Blob) {
              blobToJson(error.error).subscribe((jsonError) => {
                if (jsonError.errors) {
                  const modalStateErrors = [];
                  for (const key in jsonError.errors) {
                    if (jsonError.errors[key]) {
                      modalStateErrors.push(jsonError.errors[key]);
                    }
                  }
                  throw modalStateErrors.flat();
                } else {
                  toastr.add({
                    severity: 'error',
                    summary: error.status,
                    detail: jsonError || 'An unexpected error occurred',
                  });
                }
              });
            } else {
              toastr.add({
                severity: 'error',
                summary: error.status,
                detail: error.error,
              });
            }
            break;

          case 401:
            toastr.add({
              severity: 'error',
              summary: error.status,
              detail: 'Unauthorised',
            });
            break;

          case 404:
            router.navigateByUrl('/not-found');
            break;

          case 500:
            if (error.error instanceof Blob) {
              blobToJson(error.error).subscribe((jsonError) => {
                const navigationExtras: NavigationExtras = {
                  state: { error: jsonError },
                };
                router.navigateByUrl('/server-error', navigationExtras);
              });
            } else {
              const navigationExtras: NavigationExtras = {
                state: { error: error.error },
              };
              router.navigateByUrl('/server-error', navigationExtras);
            }

            break;

          default:
            toastr.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Something unexpected went wrong',
            });
            break;
        }
      }
      throw error;
    })
  );
};

// Since nswag automatically assigns each responseType to blob, this function is used to cast the blob to json in order to display the message in toast
function blobToJson(blob: Blob): Observable<any> {
  return new Observable<any>((observer) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        observer.next(json);
      } catch (e) {
        observer.error(e);
      }
      observer.complete();
    };

    reader.onerror = () => {
      observer.error(new Error('Error reading blob'));
    };

    reader.readAsText(blob);
  });
}
