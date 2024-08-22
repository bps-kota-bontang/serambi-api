import { CRYPTO_SALT } from "@/configs/constant";
import { CRYPTO_ALGORITHM } from "@/configs/crypto";
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "crypto";

export const encrypt = (text: string, secretKey: string) => {
  const iv = randomBytes(16);
  const key = scryptSync(secretKey, CRYPTO_SALT, 32);

  let cipher = createCipheriv(CRYPTO_ALGORITHM, key, iv);
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");

  return {
    encrypted,
    iv: iv.toString("base64"),
  };
};

export const decrypt = (text: string, ivBase64: string, secretKey: string) => {
  const key = scryptSync(secretKey, CRYPTO_SALT, 32);
  const iv = Buffer.from(ivBase64, "base64");

  const decipher = createDecipheriv(CRYPTO_ALGORITHM, key, iv);
  let decrypted = decipher.update(text, "base64", "utf8");

  return decrypted + decipher.final("utf8");
};
