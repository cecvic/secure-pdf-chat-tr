"use client";
import { Chat } from "@/components/chat";
import DropZone from "@/components/ui/dropZone";
import useUploadPdf from "@/hooks/useUploadPdf";
import { nanoid } from "ai";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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

  const handleDeleteFile = async (fileName: string) => {
    // TODO: Implement delete from Pinecone
    console.log("Deleting file:", fileName);
  };

  return (
    <main className="relative flex min-h-screen flex-col">
      <div className="flex-none">
        <h1 className="text-3xl font-bold text-center py-4">
          Secure AI PDF Chat
        </h1>
      </div>
      
      <div className="flex flex-1 gap-4 p-4">
        {/* Left side - Chat and File Management */}
        <div className="w-1/2 flex flex-col gap-4">
          {/* File Management Section */}
          <div className="rounded-lg border bg-background p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold">Uploaded Files</h2>
              <span className="text-xs text-muted-foreground">
                {files.length} file(s)
              </span>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {files.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center justify-between py-2 px-3 text-sm bg-muted/50 rounded"
                >
                  <span className="truncate flex-1">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDeleteFile(file.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete file</span>
                  </Button>
                </div>
              ))}
              {files.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-2">
                  No files uploaded
                </div>
              )}
            </div>
          </div>

          {/* Chat Section */}
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
