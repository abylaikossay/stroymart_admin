import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PublicationsService {
  fullUrl = environment.apiUrl + '/api/publications';

  constructor(private http: HttpClient) {
  }

  public getAll() {
    return this.http.get<any>(this.fullUrl + '/findAll');
  }

  public getById(id: any) {
    return this.http.get<any>(this.fullUrl + '/report', {
      params: {
        id,
      },
    });
  }

  public sendEmailToCompanies(id: any) {
    return this.http.get<any>(this.fullUrl + '/send/email', {
      params: {
        id,
      },
    });
  }

  public downloadReport(id: number): Observable<Blob> {
    return this.http.get(this.fullUrl + `/download?id=${id}`, {
      responseType: 'blob',
    });

  }
}
