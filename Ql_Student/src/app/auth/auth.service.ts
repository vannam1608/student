// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7082/api/auth/login';

  constructor(private http: HttpClient, private router: Router) {}

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const res: any = await this.http.post(this.apiUrl, { email, password }).toPromise();
      console.log('Login Response:', res);

      if (res && res.token && this.isBrowser()) {
        localStorage.setItem('token', res.token);
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      return false;
    }
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
    }
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.isBrowser() && !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return this.isBrowser() ? localStorage.getItem('token') : null;
  }

  getRole(): string {
    const token = this.getToken();
    if (!token) return '';
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || '';
  }

  getStudentId(): number | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload['StudentId'] ? +payload['StudentId'] : null;
  }

  isRoot(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload['IsRoot'] === 'true';
  }

  getEmail(): string {
    const token = this.getToken();
    if (!token) return '';
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '';
  }
  getUserName(): string {
  const token = this.getToken();
  if (!token) return 'Người dùng';

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    // Tùy vào backend, có thể đổi sang "Name", "FullName", hoặc giá trị phù hợp
    return payload['Name'] || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'Người dùng';
  } catch (e) {
    console.error('Lỗi khi decode token:', e);
    return 'Người dùng';
  }
}


}
