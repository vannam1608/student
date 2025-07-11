// src/app/shared/layout/admin-layout/admin-layout.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Thêm dòng này
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule], // Bổ sung RouterModule ở đây
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent {
  userName: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userName = this.authService.getUserName();
  }

  logout(): void {
    this.authService.logout();
  }
}
