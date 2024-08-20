import { z } from "zod";

export const FilePayloadSchema = z.object({
  type: z.string(),
  size: z.number(),
  checksum: z.string(),
  /**
   * Example: `<tagId>=<tagValue>`
   */
  tag: z.string().optional(),
  metadata: z.record(z.string()).optional(),
  folderId: z.string().optional(),
});

export interface AWSOptions {
  acceptedTypes: string[];
  maxFileSize: number;
}

export type FilePayload = z.infer<typeof FilePayloadSchema>;
