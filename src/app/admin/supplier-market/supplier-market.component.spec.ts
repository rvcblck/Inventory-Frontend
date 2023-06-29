import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierMarketComponent } from './supplier-market.component';

describe('SupplierMarketComponent', () => {
  let component: SupplierMarketComponent;
  let fixture: ComponentFixture<SupplierMarketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierMarketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
