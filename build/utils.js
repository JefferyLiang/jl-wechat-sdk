"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MD5 = exports.randomStr = void 0;
const CryptoJs = require("crypto-js");
exports.randomStr = (len, allow_chars) => {
    const ALLOW_CHARS = allow_chars ||
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = len; i > 0; --i) {
        result += ALLOW_CHARS[Math.floor(Math.random() * ALLOW_CHARS.length)];
    }
    return result;
};
exports.MD5 = (msg) => {
    return CryptoJs.MD5(msg).toString();
};
//# sourceMappingURL=utils.js.map