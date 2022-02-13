import { TestBed, inject } from '@angular/core/testing';

import { VideoProcessingServiceService } from './video-processing-service.service';

describe('VideoProcessingServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VideoProcessingServiceService]
    });
  });

  it('should be created', inject([VideoProcessingServiceService], (service: VideoProcessingServiceService) => {
    expect(service).toBeTruthy();
  }));
});
