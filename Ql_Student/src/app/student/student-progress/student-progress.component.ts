import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router,RouterModule } from '@angular/router';

@Component({
  selector: 'app-student-progress',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-progress.component.html',
})
export class StudentProgressComponent implements OnInit {
  schedule: any[] = [];
  scores: any[] = [];

  progress: {
    registeredSubjects: number;
    completedSubjects: number;
    incompletedSubjects: number;
    gpa: number;
  } | null = null;

  error: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const studentId = payload.StudentId;

    this.http.get<any>(`https://localhost:7082/api/Subject/schedule-and-score/${studentId}`).subscribe({
      next: res => {
        const data = res.data;

        // Tạo danh sách scores
        this.scores = data.map((s: any) => ({
          subjectName: s.name,
          processPoint: s.processPoint,
          componentPoint: s.componentPoint,
          finalPoint: s.finalPoint,
          isPassed: s.isPassed
        }));

        const registered = this.scores.length;
        const completed = this.scores.filter(s => s.finalPoint !== null).length;
        const incompleted = registered - completed;
        const gpa = this.calculateGPA(this.scores);

        this.progress = {
          registeredSubjects: registered,
          completedSubjects: completed,
          incompletedSubjects: incompleted,
          gpa: gpa
        };
      },
      error: () => {
        this.error = '❌ Không thể tải tiến độ học tập.';
      }
    });
  }

  calculateGPA(scores: any[]): number {
  const completedScores = scores.filter(s => s.finalPoint !== null);
  if (completedScores.length === 0) return 0;

  const convertToGPA4 = (point: number): number => {
    if (point >= 8.5) return 4.0;
    if (point >= 8.0) return 3.5;
    if (point >= 7.0) return 3.0;
    if (point >= 6.5) return 2.5;
    if (point >= 5.5) return 2.0;
    if (point >= 5.0) return 1.5;
    if (point >= 4.0) return 1.0;
    return 0.0;
  };

  const totalGPA = completedScores.reduce(
    (sum, s) => sum + convertToGPA4(s.finalPoint),
    0
  );

  return parseFloat((totalGPA / completedScores.length).toFixed(2));
}



  goBack() {
    this.router.navigate(['/student']);
  }
}
