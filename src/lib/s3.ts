import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

export const s3 = new S3Client({
  endpoint: "https://t3.storage.dev",
  forcePathStyle:true,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

export const deleteObject = async (key: string) => {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME ?? "",
      Key: key,
    }),
  );
};

export const getSignedObjectUrl = async (key: string) => {
  const cmd = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME ?? "",
    Key: key,
  });
  return getSignedUrl(s3, cmd, { expiresIn: 36000 });
};
export async function getUploadUrl(key: string) {
  const { url, fields } = await createPresignedPost(s3, {
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    Expires: 20,
    Conditions: [
      ["content-length-range", 0, 1024 * 1024 * 1024], // 1GB HARD LIMIT for demo purpose
      ["starts-with", "$Content-Type", "video/"],
    ],
  });

  return { url, fields, key };
}