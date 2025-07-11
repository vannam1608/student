import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { StudentService, Student } from '../student.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './student-form.component.html'
})
export class StudentFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  id: number | null = null;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      studentCode: ['', Validators.required],
      name: ['', Validators.required],
      gender: ['Nam', Validators.required],
      birthDate: ['', Validators.required],
      class: ['', Validators.required],
      course: ['', Validators.required]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = +idParam;
      this.isEdit = true;
      this.studentService.getById(this.id).subscribe(data => {
        if (data.birthDate) {
          const d = new Date(data.birthDate);
          if (d.getFullYear() > 1900) {
            data.birthDate = d.toISOString().substring(0, 10);
          } else {
            data.birthDate = '';
          }
        }
        this.form.patchValue({
          studentCode: data.studentCode,
          name: data.name,
          gender: data.gender,
          birthDate: data.birthDate,
          class: data.class,
          course: data.course
        });
      });
    }
  }

  submit() {
    if (this.form.invalid) return;

    const formValue = { ...this.form.value };

    // Format ngày về ISO string
    if (formValue.birthDate) {
      formValue.birthDate = new Date(formValue.birthDate).toISOString();
    }

    // Map lại tên trường cho đúng backend
    const payload: any = {
      code: formValue.studentCode,
      name: formValue.name,
      gender: formValue.gender,
      birthDate: formValue.birthDate,
      class: formValue.class,
      course: formValue.course
    };
    if (this.isEdit && this.id !== null && this.id !== undefined) {
      payload.id = this.id;
    }

    if (this.isEdit) {
      this.studentService.update(this.id!, payload).subscribe({
        next: () => this.router.navigate(['/admin/students']),
        error: err => {
          console.error('Error when saving student:', err);
          alert('Có lỗi khi cập nhật sinh viên!');
        }
      });
    } else {
      this.studentService.create(payload).subscribe({
        next: () => this.router.navigate(['/admin/students']),
        error: err => {
          console.error('Error when creating student:', err);
          alert('Có lỗi khi thêm sinh viên!');
        }
      });
    }
  }
}