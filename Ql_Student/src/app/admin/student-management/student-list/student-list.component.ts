import { Component, OnInit } from '@angular/core';
import { StudentService, Student } from '../student.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './student-list.component.html'
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  pagedStudents: Student[] = [];
  uniqueClasses: string[] = [];

  searchKeyword: string = '';
  selectedClass: string = '';
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  constructor(private studentService: StudentService, private router: Router) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents() {
    this.studentService.getAll().subscribe(data => {
      this.students = data;
      this.uniqueClasses = [...new Set(data.map(s => s.class))];
      this.filterStudents();
    });
  }

  filterStudents() {
    let filtered = this.students;

    if (this.searchKeyword) {
      const keyword = this.searchKeyword.toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(keyword) || s.studentCode.toLowerCase().includes(keyword)
      );
    }

    if (this.selectedClass) {
      filtered = filtered.filter(s => s.class === this.selectedClass);
    }

    this.filteredStudents = filtered;
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    this.currentPage = 1;
    this.updatePagedStudents();
  }

  updatePagedStudents() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedStudents = this.filteredStudents.slice(start, end);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedStudents();
  }

  edit(id: number) {
    this.router.navigate(['/admin/students/edit', id]);
  }

  delete(id: number) {
    if (confirm('❌ Bạn có chắc muốn xoá sinh viên này?')) {
      this.studentService.delete(id).subscribe(() => this.loadStudents());
    }
  }
}
