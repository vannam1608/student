import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-subject-register',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subject-register.component.html'
})
export class SubjectRegisterComponent implements OnInit {
  allSubjects: any[] = [];
  registeredSubjects: any[] = [];
  availableSubjects: any[] = [];
  message = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const studentId = payload.StudentId;

    // ✅ Lấy toàn bộ danh sách môn học
    this.http.get<any>('https://localhost:7082/api/Subject').subscribe({
      next: res => {
        this.allSubjects = res.data;

        // ✅ Sau khi lấy toàn bộ môn học, tiếp tục lấy các môn đã đăng ký
        this.http.get<any>(`https://localhost:7082/api/Subject/schedule-and-score/${studentId}`).subscribe({
          next: res2 => {
            this.registeredSubjects = res2.data;
            const registeredIds = this.registeredSubjects.map((s: any) => s.subjectId);

            // Lọc ra các môn chưa đăng ký
            this.availableSubjects = this.allSubjects.filter(sub => !registeredIds.includes(sub.id));
          },
          error: () => {
            this.message = 'Không thể tải danh sách môn đã đăng ký.';
          }
        });
      },
      error: () => {
        this.message = 'Không thể tải danh sách môn học.';
      }
    });
  }

  register(subjectId: number) {
    this.message = '';
    const token = localStorage.getItem('token');
    if (!token) return;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const studentId = payload.StudentId;

    const body = {
      studentId: studentId,
      subjectId: subjectId
    };

    this.http.post<any>('https://localhost:7082/api/Subject/register', body).subscribe({
      next: () => {
        this.message = '✅ Đăng ký thành công!';
        // Sau khi đăng ký, reload lại dữ liệu
        this.ngOnInit();
      },
      error: (err) => {
        if (err.status === 400) {
          this.message = '⚠️ Môn học đã được đăng ký rồi.';
        } else {
          this.message = '❌ Lỗi khi đăng ký môn học.';
        }
      }
    });
  }

  unregister(subjectId: number) {
    this.message = '❌ Hủy đăng ký không được phép (theo backend).';
  }
}
