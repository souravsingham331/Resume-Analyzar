import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export interface StorageProvider {
  saveFile(buffer: Buffer, originalFilename: string, mimeType: string): Promise<{ storageKey: string; fileSize: number }>;
  getFile(storageKey: string): Promise<Buffer>;
  deleteFile(storageKey: string): Promise<boolean>;
}

export class LocalStorageProvider implements StorageProvider {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.resolve(process.cwd(), process.env.STORAGE_PATH || "./uploads");
  }

  private async ensureUploadDir() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(buffer: Buffer, originalFilename: string): Promise<{ storageKey: string; fileSize: number }> {
    await this.ensureUploadDir();
    const ext = path.extname(originalFilename).toLowerCase();
    const uniqueId = crypto.randomUUID();
    const storageKey = `${uniqueId}${ext}`;
    const filePath = path.join(this.uploadDir, storageKey);

    await fs.writeFile(filePath, buffer);
    return {
      storageKey,
      fileSize: buffer.length,
    };
  }

  async getFile(storageKey: string): Promise<Buffer> {
    const filePath = path.join(this.uploadDir, path.basename(storageKey));
    return await fs.readFile(filePath);
  }

  async deleteFile(storageKey: string): Promise<boolean> {
    try {
      const filePath = path.join(this.uploadDir, path.basename(storageKey));
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

export function validateResumeFile(buffer: Buffer, filename: string, mimeType: string): { valid: boolean; error?: string } {
  // Max size: 10 MB (10 * 1024 * 1024 bytes)
  const MAX_SIZE = 10 * 1024 * 1024;
  if (buffer.length > MAX_SIZE) {
    return { valid: false, error: "File size exceeds the 10 MB limit." };
  }

  const ext = path.extname(filename).toLowerCase();
  if (ext !== ".pdf" && ext !== ".docx") {
    return { valid: false, error: "Invalid file extension. Only PDF and DOCX files are allowed." };
  }

  // File Signature (Magic Bytes) Verification
  if (ext === ".pdf") {
    // PDF Magic Bytes: %PDF (0x25 0x50 0x44 0x46)
    const isPdfMagic =
      buffer.length >= 4 &&
      buffer[0] === 0x25 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x44 &&
      buffer[3] === 0x46;

    if (!isPdfMagic) {
      return { valid: false, error: "Corrupted or invalid PDF file structure." };
    }
  } else if (ext === ".docx") {
    // DOCX Magic Bytes (ZIP header): PK (0x50 0x4b 0x03 0x04)
    const isDocxMagic =
      buffer.length >= 4 &&
      buffer[0] === 0x50 &&
      buffer[1] === 0x4b &&
      buffer[2] === 0x03 &&
      buffer[3] === 0x04;

    if (!isDocxMagic) {
      return { valid: false, error: "Corrupted or invalid DOCX file structure." };
    }
  }

  return { valid: true };
}

export const storageService = new LocalStorageProvider();
