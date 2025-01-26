"use client";

import type { Dispatch, SetStateAction } from "react";
import type { Area } from "react-easy-crop";
import { cloneElement, useRef, useState } from "react";
import EasyCropper from "react-easy-crop";

import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Slider } from "./slider";

const createImage = (url: string) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) =>
      reject(new Error(error.message)),
    );
    image.src = url;
  });

async function getCroppedImg(imageSrc: string, pixelCrop: Area) {
  const image = (await createImage(imageSrc)) as HTMLImageElement;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  // set canvas size to match the bounding box
  canvas.width = image.width;
  canvas.height = image.height;

  // draw rotated image
  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement("canvas");

  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) {
    return null;
  }

  // Set the size of the cropped canvas
  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  // Draw the cropped image onto the new canvas
  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  // As a file
  return new Promise((resolve) => {
    croppedCanvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "avatar", { type: "image/jpeg" });
        resolve(file);
      }
    }, "image/jpeg");
  });
}

interface CropperProps {
  children: JSX.Element;
  aspect?: number;
  afterCrop?: (file: File) => void;
}

const Cropper = ({ children, aspect, afterCrop }: CropperProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [image, setImage] = useState<string>("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const setFileRef = useRef<Dispatch<SetStateAction<File | undefined>>>();

  const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const cropImage = async () => {
    if (!croppedAreaPixels || !image) {
      return;
    }

    const croppedImage = (await getCroppedImg(
      image,
      croppedAreaPixels,
    )) as File;

    if (setFileRef.current) {
      setFileRef.current(croppedImage);
    }
    setOpen(false);

    if (afterCrop) {
      afterCrop(croppedImage);
    }
  };

  const onChange = (
    file: File,
    setCurrentFile: Dispatch<SetStateAction<File | undefined>>,
  ) => {
    // run children onChange
    (children.props as { onChange: (file: File) => void }).onChange(file);

    // set image to crop
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        setImage(reader.result);
        setOpen(true);
      }
    });
    reader.readAsDataURL(file);

    setFileRef.current = setCurrentFile;
  };

  return (
    <>
      {cloneElement(children, { onChange })}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crop your avatar</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <EasyCropper
            classes={{
              containerClassName: "!relative h-[40vh]",
            }}
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            showGrid={false}
          />
          <Slider
            className="m-auto my-6 max-w-64"
            value={[zoom]}
            min={1}
            max={3}
            step={0.1}
            onValueChange={(value) => {
              const zoomValue = value[0];
              if (zoomValue) {
                setZoom(zoomValue);
              }
            }}
          />
          <DialogFooter className="justify-end">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <Button onClick={cropImage} type="button">
              Crop
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Cropper;
