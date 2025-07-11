import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // ✅ Import RouterModule
import { StudentDto } from '../student-dto.model';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule, RouterModule], // ✅ Thêm RouterModule vào đây
  templateUrl: './user-info.component.html',
})
export class UserInfoComponent implements OnInit {
  student: StudentDto | null = null;
  error = false;

  constructor(private studentService: StudentService, private router: Router) {}

  goToEdit(): void {
    this.router.navigate(['/student/profile']);
  }

  ngOnInit(): void {
    this.studentService.getStudentInfo().subscribe({
      next: (data) => {
        this.student = data;
      },
      error: (err) => {
        console.error('Lỗi khi lấy thông tin sinh viên:', err);
        this.error = true;
      }
    });
  }
  goBack(): void {
    this.router.navigate(['/student']);
  }
}
