
/**
 * Note: In a true production environment, sensitive keys should never be stored 
 * or processed purely on the frontend. This is a basic client-side obfuscation
 * wrapper as requested, using base64. For real security, use a backend KMS.
 */

export const secureStorage = {
  encrypt: (data) => {
    if (!data) return data;
    try {
      // Basic encoding for demonstration purposes
      return btoa(encodeURIComponent(JSON.stringify(data)));
    } catch (e) {
      console.error("Encryption error:", e);
      return null;
    }
  },

  decrypt: (encryptedData) => {
    if (!encryptedData) return null;
    try {
      return JSON.parse(decodeURIComponent(atob(encryptedData)));
    } catch (e) {
      console.error("Decryption error:", e);
      return null;
    }
  },

  validateStripeKey: (key) => {
    return key && (key.startsWith('pk_') || key.startsWith('sk_'));
  }
};
