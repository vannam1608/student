import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectRegisterStudentComponent } from './subject-register-student.component';

describe('SubjectRegisterStudentComponent', () => {
  let component: SubjectRegisterStudentComponent;
  let fixture: ComponentFixture<SubjectRegisterStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectRegisterStudentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubjectRegisterStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
