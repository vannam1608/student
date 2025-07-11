import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentService } from '../student-management/student.service';
import { SubjectService } from '../subject-management/subject.service';
import { ScoreService } from '../score-management/score.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  totalStudents = 0;
  totalSubjects = 0;
  totalScores = 0;
  pendingScores = 0;

  constructor(
    private studentService: StudentService,
    private subjectService: SubjectService,
    private scoreService: ScoreService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.studentService.getAll().subscribe({
      next: (students) => this.totalStudents = students.length,
      error: () => this.totalStudents = 0
    });

    this.subjectService.getAll().subscribe({
      next: (subjects) => this.totalSubjects = subjects.length,
      error: () => this.totalSubjects = 0
    });

    this.scoreService.getAll().subscribe({
      next: (scores) => {
        this.totalScores = scores.filter(s => s.finalPoint !== null).length;
        this.pendingScores = scores.filter(s => s.finalPoint === null).length;
      },
      error: () => {
        this.totalScores = 0;
        this.pendingScores = 0;
      }
    });
  }
}
