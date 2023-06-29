import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestorLayoutComponent } from './requestor-layout.component';

describe('RequestorLayoutComponent', () => {
  let component: RequestorLayoutComponent;
  let fixture: ComponentFixture<RequestorLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestorLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestorLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
