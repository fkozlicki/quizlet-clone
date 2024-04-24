import type { PutObjectCommandInput } from "@aws-sdk/client-s3";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const client = new S3Client({
  region: process.env.NEXT_PUBLIC_S3_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY!,
    secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_KEY!,
  },
});

export async function uploadObject(file: File) {
  console.log(process.env.NEXT_PUBLIC_S3_REGION);

  const objectName = `${crypto.randomUUID()}`;

  const input: PutObjectCommandInput = {
    Body: file,
    Bucket: "quizletv2",
    Key: objectName,
  };

  const command = new PutObjectCommand(input);
  await client.send(command);

  const url = `/api/avatars/${objectName}`;

  return { url };
}

export async function getFileFromS3(key: string) {
  const { Body } = await client.send(
    new GetObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: key,
    }),
  );

  return Body;
}
