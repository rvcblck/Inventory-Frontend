import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseLayoutComponent } from './warehouse-layout.component';

describe('WarehouseLayoutComponent', () => {
  let component: WarehouseLayoutComponent;
  let fixture: ComponentFixture<WarehouseLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
