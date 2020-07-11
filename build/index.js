"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const Miniprogram_1 = require("./Miniprogram");
const WechatPayV2_1 = require("./WechatPayV2");
class WechatSdk extends base_1.WechatBase {
    constructor(app_id, app_secret, option = {}, merchant_id, merchant_sercert) {
        super(app_id, app_secret, option);
        this._MiniprogramSdk = null;
        this._WechatPayV2 = null;
        this._MERCHANT_ID = merchant_id || null;
        this._MERCHANT_SECERT = merchant_sercert || null;
        this._REFUND_CERT_PATH = option === null || option === void 0 ? void 0 : option.refund_cert_path;
        if (this.DEBUG) {
            console.log(`[WECHAT SDK] init with id: ${this.APP_ID}, secret: ${this.APP_SECRET} now`);
        }
    }
    get MiniprogramSdk() {
        if (this._MiniprogramSdk === null) {
            this._MiniprogramSdk = new Miniprogram_1.WechatMiniprogramSdk(this.APP_ID, this.APP_SECRET, {
                debug: this.DEBUG
            });
        }
        return this._MiniprogramSdk;
    }
    get WechatPayV2() {
        if (this._WechatPayV2 === null) {
            if (this._MERCHANT_ID === null || this._MERCHANT_SECERT === null) {
                throw new Error("can not init wechat pay sdk without merchant_id or merchant_serect");
            }
            this._WechatPayV2 = new WechatPayV2_1.default(this.APP_ID, this.APP_SECRET, this._MERCHANT_ID, this._MERCHANT_SECERT, {
                debug: this.DEBUG,
                refund_cert_path: this._REFUND_CERT_PATH
            });
        }
        return this._WechatPayV2;
    }
}
exports.default = WechatSdk;
//# sourceMappingURL=index.js.map