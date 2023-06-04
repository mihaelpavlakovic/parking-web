import { useEffect, useState } from "react";

// Custom hook for calculating size and scale factors
export const useSizeAndScale = () => {
  const [size, setSize] = useState({ x: null, y: null });
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);

  useEffect(() => {
    const calculateSizeAndScale = () => {
      const innerWidth = window.innerWidth;
      let width, height, scaleX, scaleY;

      if (innerWidth < 430) {
        width = 320;
        height = 180;
      } else if (innerWidth > 430 && innerWidth < 750) {
        width = 426;
        height = 240;
      } else if (innerWidth > 750 && innerWidth < 1000) {
        width = 640;
        height = 360;
      } else if (innerWidth > 1000 && innerWidth < 1400) {
        width = 854;
        height = 480;
      } else if (innerWidth > 1400) {
        width = 1280;
        height = 720;
      }

      scaleX = width / 640;
      scaleY = height / 360;

      return { width, height, scaleX, scaleY };
    };

    const handleResize = () => {
      const { width, height, scaleX, scaleY } = calculateSizeAndScale();
      setSize({ x: width, y: height });
      setScaleX(scaleX);
      setScaleY(scaleY);
    };

    if (size.x === null) {
      handleResize();
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [size.x]);

  return { size, scaleX, scaleY };
};
