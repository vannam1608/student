import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-layout.component.html',
})
export class StudentLayoutComponent {
  userEmail = '';

  constructor() {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.userEmail =
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '';
    }
  }

  logout() {
    localStorage.removeItem('token'); 
    location.href = '/login';
  }
}
