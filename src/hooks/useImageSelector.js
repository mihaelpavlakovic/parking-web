import { useState, useEffect } from "react";

const useImageSelector = (initialImageUrl = null) => {
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

  useEffect(() => {
    if (initialImageUrl) {
      const image = new window.Image();
      image.src = initialImageUrl;

      image.onload = () => {
        setSelectedImage(image);
      };
    }
  }, [initialImageUrl]);

  return {
    selectedImage,
    handleImageChange,
  };
};

export default useImageSelector;
