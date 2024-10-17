import { Injectable } from '@angular/core';

@Injectable()
export class PhotoService {
  constructor() {}

  public castPhotosToPhotoModel(photoUrls: string[]) {
    return photoUrls.map((url, index) => {
      return {
        itemImageSrc: url,
        thumbnailImageSrc: url,
        alt: 'https://picsum.photos/id/28/300/200',
        title: `Photo ${index + 1}`,
      };
    });
  }
}
