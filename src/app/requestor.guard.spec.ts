import { TestBed } from '@angular/core/testing';

import { RequestorGuard } from './requestor.guard';

describe('RequestorGuard', () => {
  let guard: RequestorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RequestorGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
