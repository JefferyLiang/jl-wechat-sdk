"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WechatMiniprogramSdk = void 0;
const tslib_1 = require("tslib");
const base_1 = require("./base");
const request = require("request");
class WechatMiniprogramSdk extends base_1.WechatBase {
    constructor(app_id, app_secret, option = {}) {
        super(app_id, app_secret, option);
        if (this.DEBUG) {
            console.log(`[Wechat Miniprogram SDK] init with id: ${this.APP_ID}, secret: ${this.APP_SECRET} now`);
        }
    }
    getOpenIdAndSessionKey(code) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const URL = `https://api.weixin.qq.com/sns/jscode2session?appid=${this.APP_ID}&secret=${this.APP_SECRET}&js_code=${code}&grant_type=authorization_code`;
            let result = yield new Promise((resolve, reject) => {
                request({
                    url: URL,
                    method: "GET"
                }, (err, responnse, body) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(body);
                    }
                });
            }).catch(err => {
                throw err;
            });
            return result;
        });
    }
}
exports.WechatMiniprogramSdk = WechatMiniprogramSdk;
//# sourceMappingURL=Miniprogram.js.map