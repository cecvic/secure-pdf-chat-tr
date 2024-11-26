"use client";
import { Chat } from "@/components/chat";
import DropZone from "@/components/ui/dropZone";
import useUploadPdf from "@/hooks/useUploadPdf";
import { nanoid } from "ai";
import { useState } from "react";

export default function Home() {
  const [sessionId, setSessionId] = useState<string>(`session-id-${nanoid()}`);
  const { onUpload, isUploading } = useUploadPdf(sessionId);
  const [files, setFiles] = useState<File[]>([]);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files === null) return;
    const filesArray = Array.from(files);
    setFiles(filesArray);
    await onUpload(filesArray);
  };

  return (
    <main className="relative flex min-h-screen flex-col">
      <div className="flex-none">
        <h1 className="text-3xl font-bold text-center py-4">
          Secure AI PDF Chat
        </h1>
      </div>
      
      <div className="flex flex-1 gap-4 p-4">
        {/* Left side - Chat */}
        <div className="w-1/2 flex flex-col">
          <Chat sessionId={sessionId} isUploading={isUploading} />
        </div>

        {/* Right side - PDF Viewer/Dropzone */}
        <div className="w-1/2 flex flex-col">
          <div className="rounded-lg border border-gray-200 h-full">
            {files.length > 0 ? (
              <iframe
                src={URL.createObjectURL(files[0])}
                className="w-full h-full rounded-lg"
                title="PDF Viewer"
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <DropZone
                  onFileChange={onFileChange}
                  files={files}
                  isUploading={isUploading}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
