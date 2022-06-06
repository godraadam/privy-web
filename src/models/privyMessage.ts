export interface PrivyMessage {
  from: string; // public key of sender, encrypted
  to: string;
  content: string; // content of message, encrypted
  timestamp: string; // ISO date-time string, encrypted
  nonce: string;
  signature: string;
  hash?: string;
  delivered: "delivered" | "failed" | "undetermined";
  seen?: boolean;
}
