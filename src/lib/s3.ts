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
      Bucket: process.env.BUCKET_NAME ?? "",
      Key: key,
    }),
  );
};

export const getSignedObjectUrl = async (key: string,filename?:string) => {
  const cmd = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME ?? "",
    Key: key,
    ResponseContentDisposition:`attachment; filename="${filename || "video.mp4"}"`
  });
  return getSignedUrl(s3, cmd, { expiresIn: 36000 });
};
const MAX_SIZE=1024 * 1024 * 1024
export async function getS3UploadUrl(key: string,contentType:string,fileSize:number) {
  if(fileSize>MAX_SIZE) throw new Error("File too large")
  const cmd = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME!,
    Key: key,
    ContentLength: fileSize,
    ContentType:contentType
  })
  const presignedUrl = await getSignedUrl(s3, cmd, {
      expiresIn: 360, // URL expires in 6 minutes,
          signableHeaders: new Set(["host", "content-type","content-length"]),
    });
  
  return { url:presignedUrl, key };
}