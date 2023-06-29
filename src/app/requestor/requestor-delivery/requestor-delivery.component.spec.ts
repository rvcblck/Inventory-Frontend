import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestorDeliveryComponent } from './requestor-delivery.component';

describe('RequestorDeliveryComponent', () => {
  let component: RequestorDeliveryComponent;
  let fixture: ComponentFixture<RequestorDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestorDeliveryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestorDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
