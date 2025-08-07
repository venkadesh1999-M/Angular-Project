import { TestBed } from '@angular/core/testing';

import { DailyUpdatesServiceService } from './daily-updates-service.service';

describe('DailyUpdatesServiceService', () => {
  let service: DailyUpdatesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailyUpdatesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
