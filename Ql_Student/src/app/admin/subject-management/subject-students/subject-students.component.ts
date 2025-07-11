import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common'; // ✅ import Location
import { SubjectService } from '../subject.service';

@Component({
  selector: 'app-subject-students',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './subject-students.component.html'
  
})
export class SubjectStudentsComponent implements OnInit {
  subjectId!: number;
  students: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private subjectService: SubjectService,
    private location: Location // ✅ inject Location service
  ) {}

  ngOnInit(): void {
    this.subjectId = +this.route.snapshot.paramMap.get('id')!;
    this.subjectService.getRegisteredStudents(this.subjectId)
      .subscribe(data => this.students = data);
  }

  goBack() {
    this.location.back(); // ✅ quay lại trang trước
  }
  unregisterStudent(studentId: number) {
  if (!confirm('Bạn có chắc muốn huỷ đăng ký môn học của sinh viên này không?')) return;

  this.subjectService.unregisterStudent(this.subjectId, studentId).subscribe({
    next: () => {
      alert('✅ Huỷ đăng ký thành công!');
      this.students = this.students.filter(s => s.id !== studentId); // xoá sinh viên khỏi danh sách hiển thị
    },
    error: err => {
      if (err.status === 403) {
        alert('⚠️ Bạn không có quyền huỷ đăng ký.');
      } else {
        alert('❌ Lỗi khi huỷ đăng ký môn học.');
      }
    }
  });
}

}
