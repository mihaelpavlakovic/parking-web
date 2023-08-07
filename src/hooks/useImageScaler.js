import { useEffect, useState } from "react";

const useImageScaler = () => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [originalImageSize, setOriginalImageSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      // Calculate the aspect ratio of the image
      const aspectRatio = 16 / 9;

      // Get the container width and calculate the maximum width for the image
      const containerWidth = window.innerWidth;
      const maxWidth = Math.min(containerWidth, window.innerWidth - 170);

      // Calculate the corresponding height based on the aspect ratio
      const height = maxWidth / aspectRatio;

      // If the calculated width is greater than the container width, scale down the width and recalculate the height
      if (maxWidth > containerWidth) {
        const scaledWidth = containerWidth;
        const scaledHeight = scaledWidth / aspectRatio;
        setImageSize({ width: scaledWidth, height: scaledHeight });
      } else {
        setImageSize({ width: maxWidth, height: height });
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { imageSize, originalImageSize, setOriginalImageSize };
};

export default useImageScaler;
