"use client";
import { Chat } from "@/components/chat";
import { useFileManager } from "@/hooks/useFileManager";
import DropZone from "@/components/ui/dropZone";
import { nanoid } from "ai";
import { Loader2, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import Image from "next/image";

export default function Home() {
  const [sessionId] = useState<string>(`session-id-${nanoid()}`);
  const { files, isUploading, isDeleting, onUpload, onDelete } = useFileManager({
    sessionId,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files === null) return;
    const filesArray = Array.from(files);
    await onUpload(filesArray);
    setSelectedFile(filesArray[0]);
  };

  const handleDeleteFile = async (fileName: string) => {
    await onDelete(fileName);
    if (selectedFile?.name === fileName) {
      setSelectedFile(null);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
  };

  return (
    <main className="relative flex min-h-screen flex-col">
      <div className="flex-none">
        <div className="flex items-center justify-center gap-2 py-4">
          <Image 
            src="/Trendhubs.png"
            alt="Trendhubs Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <h1 className="text-3xl font-bold">
            Trendhubs PDF Chat
          </h1>
        </div>
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
                  <div className="flex items-center gap-2">
                    {selectedFile?.name !== file.name && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-blue-500"
                        onClick={() => setSelectedFile(file)}
                      >
                        <Upload className="h-4 w-4" />
                        <span className="sr-only">View file</span>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeleteFile(file.name)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      <span className="sr-only">Delete file</span>
                    </Button>
                  </div>
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
          <div className="rounded-lg border border-gray-200 h-full relative">
            {selectedFile ? (
              <>
                <div className="absolute top-2 right-2 z-10">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleReset}
                    className="h-8"
                  >
                    Upload Another PDF
                  </Button>
                </div>
                <iframe
                  src={URL.createObjectURL(selectedFile)}
                  className="w-full h-full rounded-lg"
                  title="PDF Viewer"
                />
              </>
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

      <Toaster position="bottom-right" />
    </main>
  );
}
