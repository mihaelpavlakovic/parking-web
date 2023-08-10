export const calculateScaledPoint = (point, imageSize, originalImageSize) => {
  const scaleX = originalImageSize.width / imageSize.width;
  const scaleY = originalImageSize.height / imageSize.height;

  const x = Math.round(point.x * scaleX);
  const y = Math.round(point.y * scaleY);
  return [x, y];
};
