import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseSuppliesComponent } from './warehouse-supplies.component';

describe('WarehouseSuppliesComponent', () => {
  let component: WarehouseSuppliesComponent;
  let fixture: ComponentFixture<WarehouseSuppliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseSuppliesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseSuppliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
