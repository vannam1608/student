import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-schedule-score',
  standalone: true,
  templateUrl: './schedule-score.component.html',
  imports: [CommonModule, RouterModule],
})
export class ScheduleScoreComponent implements OnInit {
  schedule: any[] = [];
  scores: any[] = [];

  completedScores: any[] = [];
  incompletedScores: any[] = [];

  activeTab: string = 'schedule';
  filterMode: 'all' | 'completed' | 'incompleted' = 'all';

  gpa: number | null = null; // ✅ Thêm biến GPA

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const studentId = payload.StudentId;

    this.http
      .get<any>(`https://localhost:7082/api/Subject/schedule-and-score/${studentId}`)
      .subscribe({
        next: (res) => {
          const data = res.data;

          this.schedule = data.map((s: any) => ({
            subjectName: s.name,
            startDate: s.startDate,
            studyTime: s.studyTime,
            examDate: s.examDate,
            examTime: s.examTime,
          }));

          this.scores = data.map((s: any) => ({
            subjectName: s.name,
            processPoint: s.processPoint,
            componentPoint: s.componentPoint,
            finalPoint: s.finalPoint,
            isPassed: s.isPassed,
          }));

          this.completedScores = this.scores.filter((s) => s.finalPoint !== null);
          this.incompletedScores = this.scores.filter((s) => s.finalPoint === null);

          this.calculateGPA(); // ✅ Gọi tính GPA
        },
        error: () => {
          alert('❌ Không thể tải lịch học và điểm số.');
        },
      });

    this.route.queryParams.subscribe((params) => {
      const tab = params['tab'];
      if (tab === 'completed') {
        this.activeTab = 'scores';
        this.filterMode = 'completed';
      } else if (tab === 'passed' || tab === 'incompleted') {
        this.activeTab = 'scores';
        this.filterMode = 'incompleted';
      } else {
        this.activeTab = 'schedule';
        this.filterMode = 'all';
      }

      setTimeout(() => this.activateTab(), 100);
    });
  }

  activateTab() {
    const tabEl = document.querySelector(`button[data-bs-target="#${this.activeTab}"]`);
    if (tabEl) (tabEl as HTMLElement).click();
  }

  // Tách hàm quy đổi điểm 10 → 4
private convertToGPA4(score10: number): number {
  if (score10 >= 8.5) return 4.0;
  if (score10 >= 8.0) return 3.5;
  if (score10 >= 7.0) return 3.0;
  if (score10 >= 6.5) return 2.5;
  if (score10 >= 5.5) return 2.0;
  if (score10 >= 5.0) return 1.5;
  if (score10 >= 4.0) return 1.0;
  return 0.0;
}

// Hàm chính tính GPA
calculateGPA(): void {
  const completed = this.completedScores;

  if (completed.length === 0) {
    this.gpa = null;
    return;
  }

  const totalGPA = completed
    .map(s => this.convertToGPA4(s.finalPoint))
    .reduce((sum, gpa) => sum + gpa, 0);

  this.gpa = parseFloat((totalGPA / completed.length).toFixed(2));
}

}

