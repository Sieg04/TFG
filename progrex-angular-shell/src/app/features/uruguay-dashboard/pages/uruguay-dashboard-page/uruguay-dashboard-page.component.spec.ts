import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UruguayDashboardPageComponent } from './uruguay-dashboard-page.component';

describe('UruguayDashboardPageComponent', () => {
  let component: UruguayDashboardPageComponent;
  let fixture: ComponentFixture<UruguayDashboardPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UruguayDashboardPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UruguayDashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
