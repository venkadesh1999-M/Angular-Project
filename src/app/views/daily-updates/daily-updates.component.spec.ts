import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyUpdatesComponent } from './daily-updates.component';

describe('DailyUpdatesComponent', () => {
  let component: DailyUpdatesComponent;
  let fixture: ComponentFixture<DailyUpdatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyUpdatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
