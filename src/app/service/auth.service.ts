import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  private url = '/user';

  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) {}

  private getHeaders(): HttpHeaders {
    const token = this.cookieService.get('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return headers;
  }

  login(email: string, password: string): Observable<any> {
    console.log('request');
    return this.http
      .post<any>(`${this.apiUrl}/auth/login`, {
        email,
        password
      })
      .pipe(
        tap((response) => {
          this.cookieService.set('token', response.data.access_token);
          this.cookieService.set('role', response.data.role);
          localStorage.setItem('name', response.data.name);
          localStorage.setItem('user_id', response.data.user_id);
          localStorage.setItem('admin_id', response.data.admin_id);

          console.log(response.data);

          switch (response.data.role) {
            case 'Admin':
              this.router.navigate(['/admin']);
              break;
            case 'Requestor':
              this.router.navigate(['/requestor']);
              break;
            case 'Warehouse':
              this.router.navigate(['/warehouse']);
              break;
            case 'Supplier':
              this.router.navigate(['/supplier']);
              break;
          }
        }),
        catchError((error) => {
          return throwError('An error occurred while logging in');
        })
      );
  }

  logout() {
    this.cookieService.delete('token');
    this.cookieService.deleteAll();
    this.router.navigate(['/login']);
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.apiUrl}/logout`, null, { headers }).pipe(
      tap((response) => {
        return response;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  isAdmin(): boolean {
    const role = this.cookieService.get('role');
    console.log(role);
    return role === 'Admin';
  }

  isRequestor(): boolean {
    const role = this.cookieService.get('role');
    return role === 'Requestor';
  }

  isWarehouse(): boolean {
    const role = this.cookieService.get('role');
    return role === 'Warehouse';
  }

  isSupplier(): boolean {
    const role = this.cookieService.get('role');
    return role === 'Supplier';
  }
}
