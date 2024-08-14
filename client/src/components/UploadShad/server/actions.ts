"use server";

import { v4 as uuidv4 } from "uuid";
import { env } from "../../../../env";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: env.AWS_BUCKET_ACCESS_KEY,
    secretAccessKey: env.AWS_BUCKET_SECRET_ACCESS_KEY,
  },
});

// Make this universal

interface filePayload {
  type: string;
  size: number;
  checksum: string;
  /**
   * Example:  `<tagId>=<tagValue>`
   */
  tag?: string;
  metaData?: Record<string, string> | undefined;
}

interface AWSOptions {
  acceptedTypes: string[];
  maxFileSize: number;
}

export async function getSignedURL(
  { type, checksum, size, tag, metaData }: filePayload,
  { acceptedTypes, maxFileSize }: AWSOptions
) {
  // Validate request
  if (!acceptedTypes.includes(type)) {
    return { failure: "Not valid type" };
  }

  if (size > maxFileSize) {
    return { failure: "File too large." };
  }

  const key = `${env.AWS_BUCKET_PRODUCTION_FOLDER}/${uuidv4()}`;

  const command = new PutObjectCommand({
    Key: key,
    Tagging: tag,
    ContentType: type,
    Metadata: metaData,
    ContentLength: size,
    ChecksumSHA256: checksum,
    Bucket: env.AWS_BUCKET_NAME,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  return { signedURL: url };
}

export async function deleteFile(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: env.AWS_BUCKET_NAME,
    Key: `${env.AWS_BUCKET_PRODUCTION_FOLDER}/${key}`,
  });

  try {
    const response = await s3Client.send(command);
    console.log("AWS Delete Response: ", response);
    console.log("AWS Delete Response DeleteMarker: ", response.DeleteMarker);
  } catch (err) {
    console.error(err);
  }
}
