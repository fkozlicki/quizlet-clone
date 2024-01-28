import {
  InboxOutlined,
  LoadingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { Avatar, Card, Divider, Typography, Upload, message } from "antd";
import type { UploadFile } from "antd";
import type { RcFile } from "antd/es/upload";
import NextImage from "next/image";
import { useState } from "react";
import pictures from "../../data/pictures.json";
import { api } from "../../utils/api";
import ImgCrop from "antd-img-crop";
import { randomBytes } from "crypto";
import { env } from "../../env/client.mjs";

interface EditProfilePictureProps {
  image: User["image"];
  userId: User["id"];
}

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    void message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    void message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const EditProfilePicture = ({ image, userId }: EditProfilePictureProps) => {
  const [picture, setPicture] = useState<User["image"]>(image);
  const { mutate: updateUser, isLoading: updateLoading } =
    api.user.update.useMutation({
      onSuccess: ({ image }) => {
        setPicture(image);
        void message.success("Uploaded successfully");
      },
    });
  const { mutateAsync: getPresignedUrl } = api.user.presignedUrl.useMutation();
  const { mutate: uploadImage, isLoading: uploadLoading } = useMutation({
    mutationFn: async (file: File) => {
      const filename = randomBytes(32).toString("hex");
      const { preSignedUrl } = await getPresignedUrl({
        filename,
        filetype: file.type,
      });

      await fetch(preSignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      const imageUrl = `https://${env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.eu-central-1.amazonaws.com/users/${userId}/${filename}`;

      return imageUrl;
    },
    onSuccess: (data) => {
      updateUser({ image: data });
    },
  });

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as Blob);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:gap-8">
      <div className="flex items-center gap-4 lg:basis-48 lg:flex-col">
        <Avatar
          icon={<UserOutlined />}
          src={picture}
          alt=""
          className="h-16 w-16"
        />
        <Typography.Text className="text-xl font-semibold">
          Profile Picture
        </Typography.Text>
      </div>
      <Card className="flex-1">
        <div>
          <Typography.Text className="mb-4 inline-block text-base font-bold">
            Choose your profile picture
          </Typography.Text>
          <div className="flex flex-wrap gap-2">
            {pictures.map((picture, index) => (
              <NextImage
                key={index}
                onClick={() => updateUser({ image: `/profile/${picture}` })}
                src={`/profile/${picture}`}
                alt=""
                width={48}
                height={48}
                className="cursor-pointer rounded-full border"
              />
            ))}
          </div>
          <Divider className="text-sm">OR</Divider>
          <ImgCrop aspect={1 / 1}>
            <Upload.Dragger
              name="file"
              multiple={false}
              showUploadList={false}
              customRequest={(options) => {
                uploadImage(options.file as File);
              }}
              beforeUpload={beforeUpload}
              onPreview={onPreview}
              disabled={updateLoading || uploadLoading}
            >
              <p className="ant-upload-drag-icon">
                {uploadLoading || updateLoading ? (
                  <LoadingOutlined />
                ) : (
                  <InboxOutlined />
                )}
              </p>
              <p className="ant-upload-text">
                {uploadLoading || updateLoading
                  ? "Uploading image"
                  : "Click or drag file to this area to upload"}
              </p>
            </Upload.Dragger>
          </ImgCrop>
        </div>
      </Card>
    </div>
  );
};

export default EditProfilePicture;
