import React, { useState, createContext, useContext, useCallback } from "react";
import { toast } from "sonner";
import { handleDeleteFile, handleFetchSignedURL, handleUploadFile, reorder } from "../lib/ControllerLayer";

export type FilesContextType = {
  /**
   * Array of uploaded images
   */
  files: string[];
  handleDelete: (deletedFile: string) => Promise<boolean>;
  handleInput: (files: File[]) => Promise<void>;
  handleReOrder: (source: number, destination: number) => void;
};

export const FilesContext = createContext<FilesContextType | undefined>(undefined);

export function useFilesContext() {
  const context = useContext(FilesContext);
  if (!context) throw new Error("useFilesContext must be used within a FilesContextProvider");
  return context;
}

export const FilesContextProvider: React.FC<{
  onChange?: (files: string[]) => void;
  defaultValues?: string[];
  metadata?: Record<string, string> | undefined;
  children: React.ReactNode;
}> = ({ children, defaultValues, metadata, onChange }) => {
  const [files, setFiles] = useState<string[]>(defaultValues || []);
  // const [files, setFiles] = useControllableState({
  //   onChange: onChange,
  //   prop: defaultValues || [],
  // });

  const handleStateChange = useCallback(
    (newFiles: string[]) => {
      setFiles(newFiles);
      if (onChange) onChange(newFiles);
    },
    [setFiles, onChange]
  );

  // Handles (Presign & Uploading to S3) & Updating Files state
  const handleInput = async (inputFiles: File[]) => {
    const urls = await Promise.all(
      inputFiles.map(async (file) => {
        // Get Signed URL & Uploading
        const signedUrl = await handleFetchSignedURL(file);
        const fileUploadResponse = await handleUploadFile(signedUrl, file);

        if (fileUploadResponse.failure || !fileUploadResponse.url) {
          toast.error(`Failed to upload ${file.name}`, {
            description: "Please try uploading your image again.",
            duration: 5000,
          }); // Do something with error
          return "";
        }

        // Update File State
        return fileUploadResponse.url.split("?")[0];
        if (fileUploadResponse.url) {
        }
      })
    ).then((urls) => urls.filter((url) => url != ""));

    handleStateChange([...files, ...urls]);
    console.log("UploadShad Tracking: Controller Input Handler - File added to State");
  };
  // Handles deleting file from state
  const handleDelete = useCallback(
    async (deletedFile: string) => {
      // Delete File in Cloud provider (S3)
      const response = await handleDeleteFile(deletedFile);
      console.log("UploadShad Tracking: Controller Delete Handler - Response", response);

      if (!response) {
        return false;
      }

      // Update State
      const newFiles = files.filter((file) => file != deletedFile);
      handleStateChange(newFiles);
      console.log("UploadShad Tracking: Controller Delete Handler - File removed from State", deletedFile);

      return true;
    },
    [files, handleStateChange]
  );

  // Handles drag End event to reorder files
  const handleDragEnd = useCallback(
    (source: number, destination: number) => {
      const newImages = reorder(files || [], source, destination);
      handleStateChange(newImages);
    },
    [files, handleStateChange]
  );

  return (
    <FilesContext.Provider
      value={{
        files: files as string[],
        handleInput: handleInput,
        handleDelete: handleDelete,
        handleReOrder: handleDragEnd,
      }}
    >
      {children}
    </FilesContext.Provider>
  );
};
