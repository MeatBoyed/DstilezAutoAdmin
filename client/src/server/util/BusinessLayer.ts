import { ImageLoaderProps } from "next/image";

export function s3Converter(props: ImageLoaderProps) {
  const s3BaseUrl = "https://dstilezauto.s3.af-south-1.amazonaws.com/";
  const s3BaseUrlFull = "https://dstilezauto.s3.af-south-1.amazonaws.com/imagesProd";
  const cloudinaryBaseUrl = "http://res.cloudinary.com/dleilanfz/image/upload";
  const cloudinaryFullUrl = "http://res.cloudinary.com/dleilanfz/image/upload/f_auto,c_limit,w_128,q_auto";

  // Check if it's the full url
  if (props.src.startsWith(cloudinaryBaseUrl)) {
    const parts = props.src.split("/");
    const stockIdFromUrl = parts[parts.length - 2];
    const imageNameFromUrl = parts[parts.length - 1];
    return `${s3BaseUrlFull}/${stockIdFromUrl}/${imageNameFromUrl}`;
  }

  if (props.src.startsWith(s3BaseUrl)) {
    return props.src;
  }

  return `${s3BaseUrlFull}${props.src}`;
}
