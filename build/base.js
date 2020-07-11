"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WechatPayBase = exports.WechatBase = void 0;
class WechatBase {
    constructor(app_id, app_secret, option = {}) {
        this._APP_ID = app_id;
        this._APP_SECRET = app_secret;
        this._DEBUG = option.debug || false;
    }
    get APP_ID() {
        return this._APP_ID;
    }
    get APP_SECRET() {
        return this._APP_SECRET;
    }
    get DEBUG() {
        return this._DEBUG;
    }
}
exports.WechatBase = WechatBase;
class WechatPayBase extends WechatBase {
    constructor(app_id, app_secert, merchant_id, merchant_secert, option) {
        super(app_id, app_secert, option);
        this._MERCHANT_ID = merchant_id;
        this._MERCHANT_SECRET = merchant_secert;
        if (this.DEBUG) {
            console.log(`[WECHAT PAY V2 SDK] init with app_id: ${this.APP_ID}, app_secert: ${this.APP_SECRET}, merchant_id: ${this.MERCHANT_ID}, merchant_secert: ${this.MERCHANT_SECRET}`);
        }
    }
    get MERCHANT_ID() {
        return this._MERCHANT_ID;
    }
    get MERCHANT_SECRET() {
        return this._MERCHANT_SECRET;
    }
}
exports.WechatPayBase = WechatPayBase;
//# sourceMappingURL=base.js.map