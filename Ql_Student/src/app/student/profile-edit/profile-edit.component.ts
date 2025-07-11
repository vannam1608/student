import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentDto } from '../student-dto.model';
import { StudentService } from '../student.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-edit.component.html'
})
export class ProfileEditComponent implements OnInit {
  student: StudentDto = {
    id: 0,
    studentCode: '',
    name: '',
    gender: '',
    birthDate: '',
    class: '',
    course: ''
  };
  successMsg = '';
  errorMsg = '';

  constructor(private studentService: StudentService, private router: Router) {}

      goBack(): void {
        this.router.navigate(['/student/user-info']);
      }

  ngOnInit(): void {
    this.studentService.getStudentInfo().subscribe({
      next: (res) => this.student = res,
      error: () => this.errorMsg = 'Không thể tải dữ liệu sinh viên.'
    });
  }

  onSubmit(): void {
    this.studentService.updateStudent(this.student).subscribe({
      next: () => this.successMsg = 'Cập nhật thành công!',
      error: () => this.errorMsg = 'Cập nhật thất bại!'
    });
  }
}
