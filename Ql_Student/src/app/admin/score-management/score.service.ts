import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ScoreDto {
  studentId: number;
  studentName: string;
  subjectId: number;
  subjectName: string;
  processPoint: number | null;
  componentPoint: number | null;
  finalPoint: number | null;
  isPassed: boolean | null;
}

export interface InputScoreDto {
  studentId: number;
  subjectId: number;
  processScore: number;
  componentScore: number;
}

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private apiUrl = 'https://localhost:7082/api/Score';

  constructor(private http: HttpClient) {}

  // ✅ Lấy tất cả điểm của tất cả sinh viên
  getAll(): Observable<ScoreDto[]> {
    return this.http.get<any>(`${this.apiUrl}/all`).pipe(
      map(res => (res.data as any[]).map(raw => ({
        studentId: raw.studentId,
        studentName: raw.studentName,
        subjectId: raw.subjectId,
        subjectName: raw.subjectName,
        processPoint: raw.processPoint ?? null,
        componentPoint: raw.componentPoint ?? null,
        finalPoint: raw.finalPoint ?? null,
        isPassed: raw.isPassed ?? null
      } as ScoreDto)))
    );
  }

  // ✅ Lấy danh sách điểm theo sinh viên
  getByStudent(studentId: number): Observable<ScoreDto[]> {
    return this.http.get<any>(`${this.apiUrl}/student/${studentId}`).pipe(
      map(res => (res.data as any[]).map(raw => ({
        studentId: raw.studentId,
        studentName: raw.studentName,
        subjectId: raw.subjectId,
        subjectName: raw.subjectName,
        processPoint: raw.processPoint ?? null,
        componentPoint: raw.componentPoint ?? null,
        finalPoint: raw.finalPoint ?? null,
        isPassed: raw.isPassed ?? null
      } as ScoreDto)))
    );
  }

  // ✅ Nhập điểm
  inputScore(data: InputScoreDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/input`, data);
  }

  // ✅ Lấy điểm theo sinh viên + môn học
  getScoreByStudentAndSubject(studentId: number, subjectId: number): Observable<ScoreDto | undefined> {
    return this.getByStudent(studentId).pipe(
      map(scores => scores.find(s => s.subjectId === subjectId))
    );
  }

  // ✅ Xoá điểm (nếu cần)
  delete(studentId: number, subjectId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${studentId}/${subjectId}`);
  }
}
