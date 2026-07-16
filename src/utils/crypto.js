const encoder = new TextEncoder();

const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
};

const getEncryptionKey = async () => {
  const secret = import.meta.env.VITE_AES_SECRET;

  if (!secret) {
    throw new Error('La variable VITE_AES_SECRET no está configurada.');
  }

  const secretHash = await crypto.subtle.digest('SHA-256', encoder.encode(secret));

  return crypto.subtle.importKey(
    'raw',
    secretHash,
    {
      name: 'AES-GCM',
    },
    false,
    ['encrypt'],
  );
};

export const encryptAES = async (value) => {
  if (value === null || value === undefined || value === '') {
    throw new Error('No se puede cifrar un valor vacío.');
  }

  const key = await getEncryptionKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encoder.encode(String(value)),
  );

  return {
    algorithm: 'AES-256-GCM',
    iv: arrayBufferToBase64(iv),
    value: arrayBufferToBase64(encryptedBuffer),
  };
};
