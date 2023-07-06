import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierFeedComponent } from './supplier-feed.component';

describe('SupplierFeedComponent', () => {
  let component: SupplierFeedComponent;
  let fixture: ComponentFixture<SupplierFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierFeedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
