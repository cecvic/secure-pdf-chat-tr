import { cn } from "@/services/utils";
import React, { type ChangeEvent } from "react";

export interface DropZoneProps {
  files: File[];
  isUploading: boolean;
  onFileChange: (file: ChangeEvent<HTMLInputElement>) => void;
}

const DropZone: React.FC<DropZoneProps> = ({
  files,
  isUploading,
  onFileChange,
}) => {
  const ref = React.useRef<HTMLInputElement>(null);
  const hasFilesInMemory = files.length > 0;

  return (
    <React.Fragment>
      <div className="flex items-center justify-center w-full h-full">
        <div className="flex items-center justify-center w-full h-full">
          <label
            htmlFor="dropzone-file"
            aria-disabled={hasFilesInMemory}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600",
              "transition-all duration-200 ease-in-out"
            )}
          >
            {!hasFilesInMemory && !isUploading && (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <svg
                  className="w-10 h-10 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  *.pdf files only
                </p>
              </div>
            )}
            {hasFilesInMemory && isUploading && (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <svg
                  className="w-10 h-10 mb-4 text-gray-500 dark:text-gray-400 animate-spin"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V2.5"
                  />
                </svg>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Uploading...
                </p>
              </div>
            )}
            {hasFilesInMemory && !isUploading && (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <svg
                  className="w-10 h-10 mb-4 text-green-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L15 7"
                  />
                </svg>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Files uploaded
                </p>
                {files.map((file) => (
                  <p
                    key={file.name}
                    className="mt-1 text-sm text-gray-500 dark:text-gray-400"
                  >
                    {file.name}
                  </p>
                ))}
              </div>
            )}
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              multiple
              accept="application/pdf"
              onChange={onFileChange}
              ref={ref}
            />
          </label>
        </div>
      </div>
    </React.Fragment>
  );
};

export default DropZone;
