export const loadImageFromDataUrl = (
  dataUrl: string
): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image: ${dataUrl}`));
    image.src = dataUrl;
  });
};
