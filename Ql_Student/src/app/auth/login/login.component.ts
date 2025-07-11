import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'] // Sửa lại thành styleUrls
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  async login() {
    if (this.loginForm.invalid) return;
    const { email, password } = this.loginForm.value;

    try {
      const success = await this.authService.login(email!, password!);
      if (success) {
        const role = this.authService.getRole();
        this.router.navigate([role === 'Admin' ? '/admin' : '/student']);
      } else {
        this.error = 'Sai tài khoản hoặc mật khẩu.';
      }
    } catch (err) {
      this.error = 'Lỗi máy chủ hoặc kết nối.';
    }
  }
}