import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {NbToastrService} from '@nebular/theme';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  fullUrl: string = environment.apiUrl + '/api/auth';
  public authorized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient,
              private router: Router,
              private toastService: NbToastrService) {
  }

  getToken() {
    return localStorage.getItem(environment.apiToken);
  }

  public addNewContractor(object: any) {
    return this.http.post<any>(this.fullUrl + '/add', object);
  }

  public login(login: string, password: string) {
    return this.http.post<any>(this.fullUrl + '/login', {login, password});
  }

  authorize = (perf) => {
    this.authorized.next(true);
    localStorage.setItem(environment.apiToken, perf.access_token);
    const userName = perf.lastName + ' ' + perf.firstName;
    localStorage.setItem(environment.userName, userName);
    this.toastService.success('Успешно авторизован!');
    this.router.navigate(['admin']);
  }

  authFail = () => {
    this.toastService.danger('Логин или пароль введен неверно');
  }

  logout() {
    this.authorized.next(false);
    localStorage.clear();
    this.toastService.info('Вы вышли из системы');
    this.router.navigate(['auth']);
    // setTimeout(() => {
    //   window.location.reload();
    // }, 100);
  }

  checkAvailability() {
    return !!localStorage.getItem(environment.apiToken);
  }
}
