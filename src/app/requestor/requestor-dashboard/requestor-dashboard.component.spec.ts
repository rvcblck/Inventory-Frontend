import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestorDashboardComponent } from './requestor-dashboard.component';

describe('RequestorDashboardComponent', () => {
  let component: RequestorDashboardComponent;
  let fixture: ComponentFixture<RequestorDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestorDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
