import { useState, useEffect } from "react";

const useImageSelector = (initialImageUrl) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const image = new window.Image();
      image.src = reader.result;
      image.onload = () => {
        setSelectedImage(image);
      };
    };
    reader.readAsDataURL(file);
  };

  const isBase64 = (str) => {
    try {
      return window.btoa(window.atob(str)) === str;
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    if (initialImageUrl) {
      const image = new window.Image();
      if (isBase64(initialImageUrl)) {
        const dataUrl = `data:image/png;base64,${initialImageUrl}`;
        image.src = dataUrl;
      } else {
        image.src = initialImageUrl;
      }

      image.onload = () => {
        setSelectedImage(image);
      };
    } else {
      setSelectedImage(null);
    }
  }, [initialImageUrl]);

  return {
    selectedImage,
    handleImageChange,
  };
};

export default useImageSelector;
