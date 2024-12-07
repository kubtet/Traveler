import { Injectable } from '@angular/core';
import heic2any from 'heic2any';

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

  public async convertHeicToJpeg(heicFile: File) {
    try {
      const result = await heic2any({
        blob: heicFile,
        toType: 'image/jpeg',
        quality: 0.8,
      });

      const jpegBlob = Array.isArray(result) ? result[0] : result;

      const convertedFile = new File(
        [jpegBlob],
        heicFile.name.replace(/\.heic$/i, '.jpg'),
        { type: 'image/jpeg' }
      );

      return convertedFile;
    } catch (error) {
      console.error('Error converting HEIC to JPEG:', error);
      return null;
    }
  }
}
