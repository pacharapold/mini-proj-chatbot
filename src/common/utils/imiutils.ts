import sha256 from 'crypto-js/sha256';

export const createSign = (timestamp: number, data: string, k: string) => {
  const word = `${data}${timestamp}${k}`.toLowerCase();
  return sha256(word).toString();
};
