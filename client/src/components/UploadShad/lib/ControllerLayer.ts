import { FileRejection } from "react-dropzone";
import { toast } from "sonner";
import { computeSHA256, formatBytes } from "./Utils";
import { env } from "../../../../../env";

// Displays a toast when a file is rejected based on their error reason
export const handleRejectedFiles = (rejectedFiles: FileRejection[], maxSize: number) =>
  rejectedFiles.length > 0 &&
  rejectedFiles.forEach(({ errors, file }) => {
    errors.forEach((error) => {
      switch (error.code) {
        case "file-invalid-type":
          toast.error(`File ${file.name} was rejected.`, {
            description: `${file.type} are not allowed.`,
            duration: 10000,
          });
          break;
        case "file-too-large":
          toast.error(`File ${file.name} was rejected.`, {
            description: `Files bigger than ${formatBytes(maxSize)} are not allowed.`,
            duration: 10000,
          });
          break;
        case "file-too-small":
          toast.error(`File ${file.name} was rejected.`, {
            description: `Files smaller than ${formatBytes(maxSize)} are not allowed.`,
            duration: 10000,
          });
          break;
        case "too-many-files":
          toast.error(`Your files was rejected.`, {
            description: `Too many files were uploaded.`,
            duration: 10000,
          });
          break;
        default:
          toast.error("Oops, something happened.", {
            description: `File ${file.name} was rejected.`,
            duration: 10000,
          });
      }
    });
  });

// Handles reordering files
export const reorder = (list: string[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed || "");
  return result;
};

export async function handleFetchSignedURL(file: File) {
  // Get PreSign url from API
  const checksum = await computeSHA256(file);

  const signedURLResult = await fetch(
    `${env.NEXT_PUBLIC_HOST_URL}/api/images?type=${file.type}&size=${file.size}&checksum=${checksum}`
  )
    .then((res) => res.json())
    .catch((err) => {
      toast.error(`Failed to upload ${file.name}`, {
        description: "Please try uploading your image again.",
        duration: 5000,
      });
      console.log("UploadShad Tracking: Failed to get PreSigned URL - ", err);
    });

  return signedURLResult.signedURL;
}

// Post File to S3 using PreSign url
export async function handleUploadFile(signedUrl: string, file: File) {
  try {
    await fetch(signedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });
    return { url: signedUrl.split("?")[0] };
  } catch (error) {
    console.log("UploadShad Tracking: Failed to Upload File to S3 using PreSigned URL - ", error);
    return { failure: true };
  }
}

// Post File to S3 using PreSign url
export async function handleDeleteFile(url: string) {
  try {
    await fetch(`${env.NEXT_PUBLIC_HOST_URL}/api/images/delete?url=${url}`, {
      method: "POST",
    });
    return true;
  } catch (error) {
    console.log("UploadShad Tracking: Failed to Delete File in S3 File URL - ", error);
    return false;
  }
}
