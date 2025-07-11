// src/app/admin/subject-management/subject.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,map } from 'rxjs';

export interface Subject {
  id: number;
  name: string;
  sessionCount: number;
  credit: number;
  processWeight: number;
  componentWeight: number;
  startDate: string;
  studyTime: string;
  examDate: string;
  examTime: string;
}
export interface RegisteredStudentDto {
  id: number;
  studentCode: string;
  name: string;
  class: string;
  course: string;
}


@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private baseUrl = 'https://localhost:7082/api/subject';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Subject[]> {
  return this.http.get<any>(`${this.baseUrl}`).pipe(
    map(res => res.data)  // Kiểm tra res.data có phải dữ liệu mới không
  );
}


  getById(id: number): Observable<Subject> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }

  create(subject: Subject): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, subject);
  }

  update(id: number, subject: Subject): Observable<any> {
  console.log('>>> Updating Subject:', subject);  // 👈 THÊM DÒNG NÀY
  return this.http.put(`${this.baseUrl}/update/${id}`, subject);
}


  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getRegisteredStudents(subjectId: number): Observable<RegisteredStudentDto[]> {
  return this.http.get<any>(`${this.baseUrl}/${subjectId}/students`).pipe(
    map(res => res.data as RegisteredStudentDto[])
  );
}

  unregisterStudent(subjectId: number, studentId: number) {
  return this.http.delete(`https://localhost:7082/api/Subject/${subjectId}/unregister/${studentId}`);
}

}
