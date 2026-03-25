import CryptoJS from "crypto-js";

// In a real application, this should be an environment variable.
const SECRET_KEY = "zpl_admin_secret_key_12345";

/**
 * Encrypts an email into a secure token.
 */
export const encryptToken = (email: string): string => {
  return CryptoJS.AES.encrypt(email, SECRET_KEY).toString();
};

/**
 * Decrypts a token back into the original email.
 * Returns null if decryption fails.
 */
export const decryptToken = (token: string): string | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(token, SECRET_KEY);
    const decryptedEmail = bytes.toString(CryptoJS.enc.Utf8);
    
    // If the token is invalid or tampered with, decryptedEmail will be empty.
    return decryptedEmail || null;
  } catch (error) {
    console.error("Token decryption failed", error);
    return null;
  }
};
