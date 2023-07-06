import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BiddingService {
  private apiUrl = environment.apiUrl;
  private url = '/bidding';

  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) {}

  private getHeaders(): HttpHeaders {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return headers;
  }

  index(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.apiUrl}${this.url}`, { headers }).pipe(
      tap((response) => {
        return response;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  show(id: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.apiUrl}${this.url}/${id}`, { headers }).pipe(
      tap((response) => {
        return response;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  update(formData: any, id: string) {
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.apiUrl}${this.url}/${id}?_method=PUT`, formData, { headers }).pipe(
      tap((response) => {
        return response;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  store(formData: any) {
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.apiUrl}${this.url}`, formData, { headers }).pipe(
      tap((response) => {
        return response;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  delete(id: string) {
    const headers = this.getHeaders();
    return this.http.delete<any>(`${this.apiUrl}${this.url}/${id}`, { headers }).pipe(
      tap((response) => {
        return response;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
}
