"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import { cn } from ".";
import { Card, CardContent } from "./card";

export type DropzoneProps = React.InputHTMLAttributes<HTMLInputElement> & {
  onChange?: (
    file: File,
    setCurrentFile: React.Dispatch<React.SetStateAction<File | undefined>>,
  ) => void;
  children?: JSX.Element;
};

const Dropzone = React.forwardRef<HTMLInputElement, DropzoneProps>(
  ({ className, children, onChange, ...props }, ref) => {
    const [currentFile, setCurrentFile] = useState<File>();
    const onDrop = useCallback(
      function (acceptedFiles: File[]) {
        const file = acceptedFiles[0];

        if (!file) {
          return;
        }

        if (onChange) {
          onChange(file, setCurrentFile);
        }

        setCurrentFile(file);
      },
      [onChange],
    );
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
    });

    return (
      <Card
        className={cn("cursor-pointer border-dashed hover:border-primary", {
          "border-primary": isDragActive,
          className,
        })}
        {...getRootProps()}
      >
        <CardContent className="flex min-h-[96px] flex-col items-center justify-center gap-3 p-4">
          <input ref={ref} type="file" {...getInputProps()} {...props} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>
              Drag &apos;n&apos; drop some files here, or click to select files
            </p>
          )}
          {currentFile && <p>Uploaded file: {currentFile.name}</p>}
          {children}
        </CardContent>
      </Card>
    );
  },
);
Dropzone.displayName = "Dropzone";

export { Dropzone };
