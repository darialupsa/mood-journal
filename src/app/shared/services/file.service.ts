import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  x = 1;
  /***
   * Returns a file for the base64 string
   * @param data base64 string
   * @param filename Name of the file
   * @returns A file for the input base64 string
   */
  public base64ToFile(data: string, filename: string): File {
    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  /***
   * Returns the base64 string for the image file
   * @param file The file to be converted
   * @returns The base64 string as a Promise
   */
  public getBase64(file: File): Promise<string> {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        res(reader.result.toString());
      };
      reader.onerror = (error) => {
        rej(error);
      };
    });
  }

  /***
   * Returns the resized base64 string for the input base64 string
   * @param src The source base64 string to be resized
   * @param newX pixels for width
   * @param newY pixels for height
   * @returns The resized base64 string as a Promise
   */
  public compressImage(
    src: string,
    newX: number,
    newY: number
  ): Promise<string> {
    return new Promise((res) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const srcWidth = img.width;
        const srcHeight = img.height;
        const elem = document.createElement('canvas');
        const newDim = Math.min(srcWidth, srcHeight, newX, newY);
        const ratio = Math.min(newDim / srcWidth, newDim / srcHeight);
        elem.width = newDim;
        elem.height = newDim;
        const ctx = elem.getContext('2d');
        let dy = 0;
        let dx = 0;
        if (srcWidth !== srcHeight) {
          dy = (elem.height - srcHeight * ratio) / 2;
          dx = (elem.width - srcWidth * ratio) / 2;
        }
        ctx.drawImage(img, dx, dy, srcWidth * ratio, srcHeight * ratio);

        const data = ctx.canvas.toDataURL();
        res(data);
      };
      img.onerror = () => {
        // If resizing fails we can either reject the process with an error i.e. rej(error),
        // but for now we will send an empty string
        res('');
      };
    });
  }

  public getMimetypeFromBase64(base54Image) {
    let result = 'svg+xml';
    const signatures = {
      PD94bWwgdm: 'svg+xml',
      R0lGODdh: 'gif',
      R0lGODlh: 'gif',
      iVBORw0KGgo: 'png',
      '/9j/': 'jpg',
    };
    for (const s in signatures) {
      if (base54Image.indexOf(s) === 0) {
        return (result = signatures[s]);
      }
    }
    return result;
  }
}
