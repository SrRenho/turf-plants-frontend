import { useState, useEffect } from "react";

export default function useImageLoader(src) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!src) return;

    const img = new window.Image();
    img.src = src;
    img.onload = () => setImage(img);
  }, [src]);

  return image;
}