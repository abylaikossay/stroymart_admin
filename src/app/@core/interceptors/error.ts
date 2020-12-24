import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {NbToastrService} from '@nebular/theme';
import {ErrorCode} from '../models/error-code';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router,
              private toastrService: NbToastrService) {
  }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        this.router.navigate(['/auth/logout']);
      }

      if (err.status === 404) {
        this.toastrService.warning('Ошибка 404');
        // this.router.navigate(['/error/404']);
      }

      if (err.status === 403) {
        this.toastrService.warning('Ошибка 403');
        // this.router.navigate(['/error/403']);
      }

      if (err.status === 500) {
        this.toastrService.warning('Ошибка 500');
        // this.router.navigate(['/error/500']);
      }

      if (err.status === 400) {
        switch (err.error.errorCode) {
          case ErrorCode.UNAUTHORIZED: {
            this.toastrService.danger('Ошибка!', 'Введите правльный логин или пароль!');
            break;
          }
          case ErrorCode.ACCESS_DENIED: {
            this.toastrService.danger('Ошибка!', 'Доступа нет!');
            break;
          }
          case ErrorCode.INVALID_FIELD: {
            this.toastrService.danger('Ошибка!', 'Неправильно введенные данные!');
            break;
          }
        }
      }
      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }
}
