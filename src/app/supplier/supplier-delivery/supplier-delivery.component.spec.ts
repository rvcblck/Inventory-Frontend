import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierDeliveryComponent } from './supplier-delivery.component';

describe('SupplierDeliveryComponent', () => {
  let component: SupplierDeliveryComponent;
  let fixture: ComponentFixture<SupplierDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierDeliveryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
