import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 👈 cần import
import { SubjectService, Subject } from '../subject.service';

@Component({
  selector: 'app-subject-search',
  standalone: true,
  templateUrl: './subject-search.component.html',
  imports: [CommonModule, FormsModule], // 👈 thêm FormsModule
})
export class SubjectSearchComponent {
  subjectId: number | null = null;
  subject: Subject | null = null;
  error: string = '';

  constructor(private subjectService: SubjectService) {}

  search(): void {
    if (!this.subjectId) return;
    this.subjectService.getById(this.subjectId).subscribe({
      next: (data) => {
        this.subject = data;
        this.error = '';
      },
      error: (err) => {
        this.subject = null;
        this.error = err?.error?.message || 'Không tìm thấy môn học.';
      }
    });
  }

  clearSearch(): void {
    this.subjectId = null;
    this.subject = null;
    this.error = '';
  }
}
