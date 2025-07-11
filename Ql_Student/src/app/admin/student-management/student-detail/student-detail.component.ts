import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StudentService, Student } from '../student.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './student-detail.component.html'
})
export class StudentDetailComponent implements OnInit {
  student: Student | null = null;
  subjects: any[] = [];

  showScores: boolean = false;
  showSchedule: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.loadStudent(id);
      this.loadSubjectsAndScores(id);
    }
  }

  loadStudent(id: number) {
    this.studentService.getById(id).subscribe({
      next: s => (this.student = s),
      error: err => console.error('Lỗi khi tải sinh viên:', err)
    });
  }

  loadSubjectsAndScores(studentId: number) {
    this.http
      .get<any>(`https://localhost:7082/api/Subject/schedule-and-score/${studentId}`)
      .subscribe({
        next: res => (this.subjects = res.data),
        error: err => console.error('Lỗi khi tải môn học:', err)
      });
  }

  toggleScores() {
    this.showScores = !this.showScores;
  }

  toggleSchedule() {
    this.showSchedule = !this.showSchedule;
  }
}
