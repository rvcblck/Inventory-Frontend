import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseOrdersComponent } from './warehouse-orders.component';

describe('WarehouseOrdersComponent', () => {
  let component: WarehouseOrdersComponent;
  let fixture: ComponentFixture<WarehouseOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseOrdersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
