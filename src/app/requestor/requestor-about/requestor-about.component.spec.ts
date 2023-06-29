import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestorAboutComponent } from './requestor-about.component';

describe('RequestorAboutComponent', () => {
  let component: RequestorAboutComponent;
  let fixture: ComponentFixture<RequestorAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestorAboutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestorAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
