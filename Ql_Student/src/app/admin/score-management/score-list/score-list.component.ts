import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ScoreService, ScoreDto } from '../score.service';

@Component({
  selector: 'app-score-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './score-list.component.html'
})
export class ScoreListComponent implements OnInit {
  form!: FormGroup;
  scores: ScoreDto[] = [];
  groupedScores: { studentId: number, studentName: string, scores: ScoreDto[] }[] = [];
  filteredGroups: { studentId: number, studentName: string, scores: ScoreDto[] }[] = [];

  loading: boolean = false;
  searchTerm: string = '';

  pageSize = 5;
  currentPage = 1;
  totalPages = 0;
  studentId?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private scoreService: ScoreService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      studentId: ['', Validators.required],
      subjectId: ['', Validators.required],
      processScore: [0, [Validators.min(0), Validators.max(10)]],
      componentScore: [0, [Validators.min(0), Validators.max(10)]],
    });

    this.route.queryParams.subscribe((params: any) => {
      const sId = params['studentId'];
      if (sId) {
        this.studentId = +sId;
        this.loadScoresByStudent(this.studentId);
      } else {
        this.loadScores();
      }

      this.form.patchValue({
        studentId: sId ?? '',
        subjectId: params['subjectId'] ?? ''
      });
    });
  }

  loadScores(): void {
    this.loading = true;
    this.scoreService.getAll().subscribe({
      next: (data: ScoreDto[]) => {
        this.scores = data;
        this.groupedScores = this.groupScoresByStudent(data);
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Lỗi tải danh sách điểm:', err);
        this.loading = false;
      }
    });
  }

  loadScoresByStudent(studentId: number): void {
    this.loading = true;
    this.scoreService.getByStudent(studentId).subscribe({
      next: (data: ScoreDto[]) => {
        this.scores = data;
        this.groupedScores = this.groupScoresByStudent(data);
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Lỗi tải điểm sinh viên:', err);
        this.loading = false;
      }
    });
  }

  groupScoresByStudent(data: ScoreDto[]): { studentId: number, studentName: string, scores: ScoreDto[] }[] {
    const groups: { [key: number]: { studentId: number, studentName: string, scores: ScoreDto[] } } = {};
    for (const s of data) {
      if (!groups[s.studentId]) {
        groups[s.studentId] = {
          studentId: s.studentId,
          studentName: s.studentName,
          scores: []
        };
      }
      groups[s.studentId].scores.push(s);
    }
    return Object.values(groups);
  }

  applyFilter(): void {
    const keyword = this.searchTerm.toLowerCase().trim();
    this.filteredGroups = this.groupedScores.filter(group =>
      group.studentName.toLowerCase().includes(keyword) ||
      group.studentId.toString().includes(keyword)
    );

    this.totalPages = Math.ceil(this.filteredGroups.length / this.pageSize);
    this.currentPage = 1;
  }

  get pagedGroups() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredGroups.slice(start, start + this.pageSize);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }
}
