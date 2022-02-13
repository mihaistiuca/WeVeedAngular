import { WINDOW } from '@ng-toolkit/universal';
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class VideoProcessingService {

  private numberOfThumbnails: number = 6;
  private numberOfSecondsForPreview: number = 5;
  private numberOfSecondsForPreviewBigVideo: number = 20;
  public bigVideoLengthSeconds: number = 900;

  constructor(@Inject(WINDOW) private window: Window, 
    @Inject(DOCUMENT) private document: Document
  ) { }

  public promptForVideo(droppedFile: File): Promise<File> {
    return new Promise<File>((resolve, reject) => {
      if (droppedFile) {
        resolve(droppedFile);
        return;
      }

      const fileInput: HTMLInputElement = this.document.createElement('input');

      fileInput.type = 'file';
      fileInput.accept = 'video/*';
      fileInput.setAttribute('capture', 'camera');
      
      fileInput.addEventListener('error', event => {
        reject('Ceva nu a mers bine. Incearca din nou.');
      });
      fileInput.addEventListener('change', event => {
        resolve(fileInput.files[0]);
      });
      
      fileInput.click();
    });
  }

  public generateThumbnails(videoFile: Blob): Promise<any[]> {
    const video: HTMLVideoElement = this.document.createElement('video');
    const canvas: HTMLCanvasElement = this.document.createElement('canvas');
    const context: CanvasRenderingContext2D = canvas.getContext('2d');
    
    const canvas2: HTMLCanvasElement = this.document.createElement('canvas');
    const context2: CanvasRenderingContext2D = canvas.getContext('2d');
    let count = 0;
    let result: any[] = [ videoFile ];

    return new Promise<any[]>((resolve, reject) => {
      canvas.addEventListener('error',  reject);
      video.addEventListener('error',  reject);

      video.addEventListener('canplay', event => {
        count++;
        // canvas.width = video.videoWidth;
        // canvas.height = video.videoHeight;
        // canvas.width = 240;
        // canvas.height = 135;

        canvas.width = 480;
        canvas.height = 270;

        // debugger;
        // context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        context.drawImage(video, 0, 0, 480, 270);

        result.push(canvas.toDataURL());
        if(count == this.numberOfThumbnails) {
          result.push(video.duration);
          resolve(result);
          return;
        }

        video.currentTime += video.duration / this.numberOfThumbnails;
      });

      if (videoFile.type) {
        video.setAttribute('type', videoFile.type);
      }
      video.preload = 'auto';
      video.src = this.window.URL.createObjectURL(videoFile);
      video.load();
      video.currentTime = 0;
    });
  }

  public generateAllThumbnails(videoFile: Blob): Promise<string[]> {
    const video: HTMLVideoElement = this.document.createElement('video');
    const canvas: HTMLCanvasElement = this.document.createElement('canvas');
    const context: CanvasRenderingContext2D = canvas.getContext('2d');
    
    let result: any[] = [];

    return new Promise<string[]>((resolve, reject) => {
      canvas.addEventListener('error',  reject);
      video.addEventListener('error',  reject);

      video.addEventListener('canplay', event => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

        result.push(canvas.toDataURL());
        if(video.currentTime >= video.duration) {
          resolve(result);
          return;
        }

        // video.currentTime += video.duration / this.numberOfThumbnails;
        if (video.duration > this.bigVideoLengthSeconds) {
          video.currentTime += this.numberOfSecondsForPreviewBigVideo;
        }
        else {
          video.currentTime += this.numberOfSecondsForPreview;
        }
      });

      if (videoFile.type) {
        video.setAttribute('type', videoFile.type);
      }
      video.preload = 'auto';
      video.src = this.window.URL.createObjectURL(videoFile);
      video.load();
      video.currentTime = 0;
    });
  }
}
