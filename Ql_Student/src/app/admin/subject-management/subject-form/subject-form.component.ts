import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SubjectService, Subject } from '../subject.service';

@Component({
  selector: 'app-subject-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './subject-form.component.html'
})
export class SubjectFormComponent implements OnInit {
  form!: FormGroup;
  id: number | null = null;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private subjectService: SubjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
  this.form = this.fb.group({
    name: ['', Validators.required],
    sessionCount: [0, [Validators.required, Validators.min(1)]],
    credit: [1, [Validators.required, Validators.min(1)]],
    processWeight: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
    componentWeight: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
    startDate: ['', Validators.required],
    studyTime: ['', Validators.required],
    examDate: ['', Validators.required],
    examTime: ['', Validators.required]
  });

  const idParam = this.route.snapshot.paramMap.get('id');
  if (idParam) {
    this.id = +idParam;
    this.isEdit = true;
    this.subjectService.getById(this.id).subscribe(subject => {
      if (subject) {
        const toDateOnly = (dateStr: string) =>
          new Date(dateStr).toISOString().split('T')[0];

        this.form.patchValue({
          name: subject.name,
          sessionCount: +subject.sessionCount,              // ép kiểu về số
          credit: +subject.credit,
          processWeight: +subject.processWeight,
          componentWeight: +subject.componentWeight,
          startDate: toDateOnly(subject.startDate),
          studyTime: subject.studyTime,
          examDate: toDateOnly(subject.examDate),
          examTime: subject.examTime
        });
      }
    });
  }
}


submit() {
  if (this.form.invalid) return;

  const subject: Subject = {
    id: this.id ?? 0,
    name: this.form.value.name,
    sessionCount: +this.form.value.sessionCount,
    credit: +this.form.value.credit,
    processWeight: +this.form.value.processWeight,
    componentWeight: +this.form.value.componentWeight,
    startDate: this.form.value.startDate,
    studyTime: this.form.value.studyTime,
    examDate: this.form.value.examDate,
    examTime: this.form.value.examTime,
  };

  console.log('📦 Gửi subject:', subject);

  const request = this.isEdit
    ? this.subjectService.update(this.id!, subject)
    : this.subjectService.create(subject);

  request.subscribe(() => {
    this.router.navigateByUrl('/admin/subjects', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/admin/subjects']);
    });
  });
}

}
