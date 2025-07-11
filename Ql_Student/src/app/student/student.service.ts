import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StudentDto } from './student-dto.model';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private apiUrl = 'https://localhost:7082/api/Student';

  constructor(private http: HttpClient) {}

  /** 🧠 Trích ID từ JWT token để lấy thông tin sinh viên */
  getStudentInfo(): Observable<StudentDto> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token not found');

    const payload = JSON.parse(atob(token.split('.')[1]));
    const id = payload.StudentId;

    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(res => ({
        id: res.data.id,
        studentCode: res.data.code,  // Backend trả về 'code'
        name: res.data.name,
        gender: res.data.gender,
        birthDate: res.data.birthDate,
        class: res.data.class,
        course: res.data.course
      }))
    );
  }

  /** ✏️ Cập nhật thông tin sinh viên */
  updateStudent(student: StudentDto): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token not found');

    const payload = JSON.parse(atob(token.split('.')[1]));
    const id = payload.StudentId;

    const requestBody = {
      id: student.id,
      code: student.studentCode, // Gửi dưới dạng 'code' cho backend
      name: student.name,
      gender: student.gender,
      birthDate: student.birthDate,
      class: student.class,
      course: student.course
    };

    return this.http.put(`${this.apiUrl}/update-profile/${id}`, requestBody);
  }
  /** 📊 Lấy tiến độ học tập của sinh viên */
getProgress(): Observable<any> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token not found');

  const payload = JSON.parse(atob(token.split('.')[1]));
  const id = payload.StudentId;

  return this.http.get(`${this.apiUrl}/${id}/progress`);
}

}
