import * as CryptoJs from "crypto-js";

export const randomStr = (len: number, allow_chars?: string) => {
  const ALLOW_CHARS =
    allow_chars ||
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = len; i > 0; --i) {
    result += ALLOW_CHARS[Math.floor(Math.random() * ALLOW_CHARS.length)];
  }
  return result;
};

export const MD5 = (msg: string) => {
  return CryptoJs.MD5(msg).toString();
};
