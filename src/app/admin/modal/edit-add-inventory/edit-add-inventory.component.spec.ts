import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAddInventoryComponent } from './edit-add-inventory.component';

describe('EditAddInventoryComponent', () => {
  let component: EditAddInventoryComponent;
  let fixture: ComponentFixture<EditAddInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAddInventoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAddInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
