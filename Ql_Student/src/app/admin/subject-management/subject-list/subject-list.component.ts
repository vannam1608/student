import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SubjectService, Subject } from '../subject.service';

@Component({
  selector: 'app-subject-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './subject-list.component.html'
})
export class SubjectListComponent implements OnInit {
  subjects: Subject[] = [];
  pagedSubjects: Subject[] = [];

  // ✅ Hiển thị 10 môn mỗi trang
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;

  constructor(private subjectService: SubjectService, private router: Router) {}

  ngOnInit() {
    this.loadSubjects();
  }

  loadSubjects() {
    this.subjectService.getAll().subscribe(data => {
      this.subjects = data;
      this.totalPages = Math.ceil(data.length / this.pageSize);
      this.updatePagedSubjects();
    });
  }

  updatePagedSubjects() {
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedSubjects = this.subjects.slice(start, start + this.pageSize);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedSubjects();
  }

  delete(id: number) {
    if (confirm('Bạn có chắc muốn xoá môn học này?')) {
      this.subjectService.delete(id).subscribe(() => this.loadSubjects());
    }
  }
}


