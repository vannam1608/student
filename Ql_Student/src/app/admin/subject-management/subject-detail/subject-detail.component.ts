import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SubjectService, Subject } from '../subject.service';

@Component({
  selector: 'app-subject-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './subject-detail.component.html'
})
export class SubjectDetailComponent implements OnInit {
  subject!: Subject;
  loading = true;

  constructor(
    private subjectService: SubjectService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.subjectService.getById(id).subscribe({
      next: subject => {
        this.subject = subject;
        this.loading = false;
      }
    });
  }
}
