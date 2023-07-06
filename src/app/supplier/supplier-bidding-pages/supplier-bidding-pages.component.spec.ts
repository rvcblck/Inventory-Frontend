import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierBiddingPagesComponent } from './supplier-bidding-pages.component';

describe('SupplierBiddingPagesComponent', () => {
  let component: SupplierBiddingPagesComponent;
  let fixture: ComponentFixture<SupplierBiddingPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierBiddingPagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierBiddingPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
