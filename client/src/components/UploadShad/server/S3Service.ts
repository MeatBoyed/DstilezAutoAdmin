import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../../../../env";
import { AWSOptions, FilePayload } from "../types";

class S3Service {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: env.AWS_BUCKET_REGION,
      credentials: {
        accessKeyId: env.AWS_BUCKET_ACCESS_KEY,
        secretAccessKey: env.AWS_BUCKET_SECRET_ACCESS_KEY,
      },
    });
  }

  generateKey(folderId?: string) {
    return `${env.AWS_BUCKET_PRODUCTION_FOLDER}/${folderId && folderId + "/"}${uuidv4()}`;
  }

  getKeyfromUrl(url: string) {
    return url.split(`${env.NEXT_PUBLIC_AWS_BASE_URL}/`)[1];
  }

  async getSignedURL({ type, checksum, size, tag, metadata, folderId }: FilePayload, { acceptedTypes, maxFileSize }: AWSOptions) {
    // Validate request
    if (!acceptedTypes.includes(type)) {
      return { failure: "Not valid type" };
    }

    if (size > maxFileSize) {
      return { failure: "File too large." };
    }

    const key = this.generateKey(folderId);

    const command = new PutObjectCommand({
      Key: key,
      Tagging: tag,
      ContentType: type,
      Metadata: metadata,
      ContentLength: size,
      ChecksumSHA256: checksum,
      Bucket: env.AWS_BUCKET_NAME,
    });

    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });

    return { signedURL: url };
  }

  async deleteFile(url: string) {
    const command = new DeleteObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: this.getKeyfromUrl(url),
    });

    try {
      await this.s3Client.send(command);
      // console.log("AWS Delete Response: ", response);
      return { success: true };
    } catch (err) {
      return { failure: err };
    }
  }

  async deleteFiles(files: string[]) {
    Promise.all(
      files.map((file, index) => {
        this.deleteFile(file);
      })
    );
  }
}

export default S3Service;
