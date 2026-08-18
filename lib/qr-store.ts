export interface QrRecord {
  destinationUrl: string;
  tokenHash: string;
  createdAt: number;
  updatedAt: number;
}

export const qrKey = (id: string) => `qr:${id}`;
