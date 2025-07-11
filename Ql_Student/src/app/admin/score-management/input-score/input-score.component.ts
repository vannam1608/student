import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ScoreService } from '../score.service';

@Component({
  selector: 'app-input-score',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-score.component.html'
})
export class InputScoreComponent implements OnInit {
  form!: FormGroup;
  submitting = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private scoreService: ScoreService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      studentId: ['', Validators.required],
      subjectId: ['', Validators.required],
      processScore: [null, [Validators.min(0), Validators.max(10)]],
      componentScore: [null, [Validators.min(0), Validators.max(10)]]
    });

    this.route.queryParams.subscribe(params => {
      const studentId = +params['studentId'];
      const subjectId = +params['subjectId'];

      if (studentId && subjectId) {
        this.form.patchValue({ studentId, subjectId });

        this.scoreService.getScoreByStudentAndSubject(studentId, subjectId).subscribe(score => {
          if (score) {
            this.form.patchValue({
              processScore: score.processPoint,
              componentScore: score.componentPoint
            });
          }
        });
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    this.scoreService.inputScore(this.form.value).subscribe({
      next: () => {
        alert('✅ Nhập điểm thành công');
        this.router.navigate(['/admin/scores']);
      },
      error: (err) => {
        console.error('❌ Lỗi nhập điểm:', err);
        this.errorMessage = err?.error?.message || 'Đã xảy ra lỗi khi nhập điểm.';
        this.submitting = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/scores']);
  }
}
