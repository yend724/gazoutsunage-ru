export const drawImagesToCanvas = (
  ctx: CanvasRenderingContext2D,
  images: HTMLImageElement[]
) => {
  const minHeight = Math.min(...images.map(img => img.naturalHeight));

  const scaledWidths = images.map(img => {
    const scale = minHeight / img.naturalHeight;
    return img.naturalWidth * scale;
  });
  const totalWidth = scaledWidths.reduce((sum, width) => sum + width, 0);

  const canvas = ctx.canvas;
  canvas.width = totalWidth;
  canvas.height = minHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let tempX = 0;
  images.forEach((image, index) => {
    const scaledWidth = scaledWidths[index];
    ctx.drawImage(image, tempX, 0, scaledWidth, minHeight);
    tempX += scaledWidth;
  });

  return { width: canvas.width, height: canvas.height };
};

export const downloadCanvasAsImage = (canvas: HTMLCanvasElement) => {
  try {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `composed-image-${new Date().getTime()}.png`;
    link.click();
  } catch (error) {
    console.error('Failed to download image:', error);
  }
};
