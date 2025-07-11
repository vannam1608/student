import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectRegisterComponent } from './subject-register.component';

describe('SubjectRegisterComponent', () => {
  let component: SubjectRegisterComponent;
  let fixture: ComponentFixture<SubjectRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectRegisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubjectRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
