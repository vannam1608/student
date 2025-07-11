import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-subject-register-student',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './subject-register-student.component.html'
})
export class SubjectRegisterStudentComponent implements OnInit {
  subjectId!: number;
  form!: FormGroup;
  message = '';
  students: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subjectId = +this.route.snapshot.paramMap.get('id')!;
    this.loadStudents();

    this.form = this.fb.group({
      studentId: ['', Validators.required]
    });
  }

  loadStudents() {
    this.http.get<any>('https://localhost:7082/api/Student').subscribe({
      next: res => this.students = res.data,
      error: () => this.message = 'Không tải được danh sách sinh viên.'
    });
  }

  onSubmit() {
  if (this.form.invalid) return;

  const studentId = this.form.value.studentId;
  const body = {
    studentId: studentId,
    subjectId: this.subjectId
  };

  this.http.post<any>('https://localhost:7082/api/Subject/register', body).subscribe({
    next: res => {
      if (res?.success) {
        this.message = '✅ Đăng ký thành công' + res.message;
        this.form.reset(); // hoặc điều hướng nếu muốn
      } else {
        this.message = '❌ ' + (res.message || 'Đăng ký thất bại.');
      }
    },
    error: err => {
      // Trường hợp trả về lỗi BadRequest vẫn là ApiResponse nhưng nằm trong error.error
      const apiError = err.error;
      if (apiError?.message) {
        this.message = '❌ ' + apiError.message;
      } else {
        this.message = '❌ Lỗi không xác định.';
      }
    }
  });
}




  goBack() {
    this.router.navigate(['/admin/subjects']);
  }
}
