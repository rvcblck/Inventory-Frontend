import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseInventoryCountComponent } from './warehouse-inventory-count.component';

describe('WarehouseInventoryCountComponent', () => {
  let component: WarehouseInventoryCountComponent;
  let fixture: ComponentFixture<WarehouseInventoryCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseInventoryCountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseInventoryCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
