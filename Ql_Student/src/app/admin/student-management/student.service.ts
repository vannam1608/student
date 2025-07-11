import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Student {
  id: number;
  studentCode: string;
  name: string;
  gender: string;
  birthDate: string; // ✅ dùng birthDate cho khớp DTO backend
  class: string;
  course: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl = 'https://localhost:7082/api/student';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Student[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(res =>
        res.data.map((raw: any) => ({
          id: raw.id,
          studentCode: raw.studentCode ?? raw.code,
          name: raw.name,
          gender: raw.gender,
          birthDate: raw.birthDate, // ✅ chính xác với DTO
          class: raw.class,
          course: raw.course
        } as Student))
      )
    );
  }

  getById(id: number): Observable<Student> {
    return this.http.get<{ success: boolean; data: any }>(`${this.baseUrl}/${id}`).pipe(
      map(res => {
        const raw = res.data;
        return {
          id: raw.id,
          studentCode: raw.studentCode ?? raw.code,
          name: raw.name,
          gender: raw.gender,
          birthDate: raw.birthDate, // ✅ dùng đúng field
          class: raw.class,
          course: raw.course
        } as Student;
      })
    );
  }

  create(student: Partial<Student>): Observable<Student> {
    return this.http
      .post<{ success: boolean; data: Student }>(`${this.baseUrl}/add`, student)
      .pipe(map(res => res.data));
  }

  update(id: number, student: Partial<Student>): Observable<any> {
    return this.http.put<{ success: boolean; message: string }>(
      `${this.baseUrl}/update-profile/${id}`,
      student
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.baseUrl}/${id}`
    );
  }
}
