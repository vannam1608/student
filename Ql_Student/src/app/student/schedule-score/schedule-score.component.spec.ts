import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleScoreComponent } from './schedule-score.component';

describe('ScheduleScoreComponent', () => {
  let component: ScheduleScoreComponent;
  let fixture: ComponentFixture<ScheduleScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleScoreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScheduleScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
