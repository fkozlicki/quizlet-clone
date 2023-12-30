import {
  InboxOutlined,
  LoadingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { Avatar, Card, Divider, Typography, Upload, message } from "antd";
import type { RcFile } from "antd/es/upload";
import Image from "next/image";
import { useState } from "react";
import pictures from "../../data/pictures.json";
import { api } from "../../utils/api";

interface EditProfilePictureProps {
  image: User["image"];
}

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dkg9zehpc/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "quizletv2";

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

const EditProfilePicture = ({ image }: EditProfilePictureProps) => {
  const [picture, setPicture] = useState<User["image"]>(image);
  const { mutate: updateUser, isLoading: updateLoading } =
    api.user.update.useMutation({
      onSuccess: ({ image }) => {
        setPicture(image);
        void message.success("Uploaded successfully");
      },
    });
  const { mutate: uploadImage, isLoading: uploadLoading } = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: data,
      });
      return res.json() as Promise<{ secure_url: string }>;
    },
    onSuccess: (data) => {
      updateUser({ image: data.secure_url });
    },
  });

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
              <Image
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
          <Upload.Dragger
            name="file"
            multiple={false}
            showUploadList={false}
            customRequest={(options) => {
              const data = new FormData();
              data.append("file", options.file);
              data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
              uploadImage(data);
            }}
            beforeUpload={beforeUpload}
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
        </div>
      </Card>
    </div>
  );
};

export default EditProfilePicture;
