import { useState } from "react";
import { toast } from "sonner";

interface UseFileManagerProps {
  sessionId: string;
}

interface FileManagerState {
  files: File[];
  isUploading: boolean;
  isDeleting: boolean;
}

export function useFileManager({ sessionId }: UseFileManagerProps) {
  const [state, setState] = useState<FileManagerState>({
    files: [],
    isUploading: false,
    isDeleting: false,
  });

  const onUpload = async (files: File[]) => {
    const formData = new FormData();
    for (const file of files) {
      formData.append(`file-${file.name}`, file);
    }

    setState((prev) => ({ ...prev, isUploading: true }));

    try {
      const response = await fetch(`/api/pdf?sessionId=${sessionId}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      setState((prev) => ({
        ...prev,
        files: [...files],
        isUploading: false,
      }));

      toast.success("Files uploaded successfully");
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Failed to upload files. Please try again.");
      setState((prev) => ({ ...prev, isUploading: false }));
    }
  };

  const onDelete = async (fileName: string) => {
    setState((prev) => ({ ...prev, isDeleting: true }));

    try {
      const response = await fetch(
        `/api/pdf/delete?sessionId=${sessionId}&fileName=${encodeURIComponent(
          fileName
        )}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setState((prev) => ({
        ...prev,
        files: prev.files.filter((file) => file.name !== fileName),
        isDeleting: false,
      }));

      toast.success("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file. Please try again.");
      setState((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  return {
    files: state.files,
    isUploading: state.isUploading,
    isDeleting: state.isDeleting,
    onUpload,
    onDelete,
  };
} 