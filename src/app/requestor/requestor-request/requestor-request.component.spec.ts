import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestorRequestComponent } from './requestor-request.component';

describe('RequestorRequestComponent', () => {
  let component: RequestorRequestComponent;
  let fixture: ComponentFixture<RequestorRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestorRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestorRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
