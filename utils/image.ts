export type ImgDataFormSrc = {
  height: number;
  width: number;
  aspectRatio: string;
  imageHtml: HTMLImageElement;
};

export type ImgDataUpload = ImgDataFormSrc & {
  src: string;
  file: File;
};

export default class ImageUtils {
  static gcd(a: number, b: number): number {
    return b === 0 ? a : ImageUtils.gcd(b, a % b);
  }
  static getImgProperty(src: string): Promise<ImgDataFormSrc> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        const divisor = ImageUtils.gcd(width, height);
        const aspectRatio = `${width / divisor}:${height / divisor}`;
        resolve({
          aspectRatio,
          width,
          height,
          imageHtml: img,
        });
      };
      img.onerror = reject;
    });
  }

  static isValidAspectRatio(ratio: string): boolean {
    const aspectRatioRegex: RegExp = /^(\d+([.,]\d+)?)[:](\d+([.,]\d+)?)$/;
    return aspectRatioRegex.test(ratio);
  }

  static getDataFromImageFile(file: File): Promise<ImgDataUpload> {
    return new Promise((resolve, reject) => {
      if (!file.type.includes("image"))
        reject(new Error("Please select an image!"));
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const result = reader.result as string;
        const imgProperty = await ImageUtils.getImgProperty(result);
        resolve({
          ...imgProperty,
          src: result,
          file: file,
        });
      };
      reader.onerror = reject;
    });
  }

  static async convertUrlToFile(url: string) {
    try {
      // Bước 1: Tải image từ URL
      const response = await fetch(url);
      // Bước 2: Chuyển response thành Blob
      const blob = await response.blob();
      // Bước 3: Chuyển Blob thành File
      const filename = url.split("/").pop(); // Lấy tên file từ URL
      const file = new File([blob], filename!, {
        type: blob.type || "image/jpeg", // Fallback type
      });
      return file;
    } catch (error) {
      console.error("Error converting URL to File:", error);
      return null;
    }
  }
}
