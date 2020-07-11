"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const base_1 = require("./base");
const utils_1 = require("./utils");
const request = require("request");
const xml2json = require("xml2json");
const js2xmlparser = require("js2xmlparser");
const fs = require("fs");
class WechatPayV2SDK extends base_1.WechatPayBase {
    constructor(app_id, app_secert, merchant_id, merchant_secert, option) {
        super(app_id, app_secert, merchant_id, merchant_secert, option);
        this._REFUND_CERT_PATH = option.refund_cert_path || null;
    }
    http(url, method, body, option) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let result = yield new Promise((resolve, reject) => {
                let request_config = {
                    url,
                    method,
                    body
                };
                if (option) {
                    request_config = Object.assign(request_config, option);
                }
                request(request_config, (err, response, body) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        let data = JSON.parse(xml2json.toJson(body));
                        resolve(data.xml);
                    }
                });
            }).catch(err => {
                throw err;
            });
            return result;
        });
    }
    sign(post_data) {
        const KEYS = Object.keys(post_data);
        let signStr = KEYS.map(key => {
            return `${key}=${post_data[key]}`;
        }).join("&") + `&key=${this.MERCHANT_SECRET}`;
        return utils_1.MD5(signStr).toUpperCase();
    }
    jsonToXml(post_data) {
        return js2xmlparser.parse("xml", post_data);
    }
    create(device_info, body, out_trade_no, total_fee, spbill_create_ip, notify_url, trade_type, option) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const URL = "https://api.mch.weixin.qq.com/pay/unifiedorder";
            let nonce_str = utils_1.randomStr(16);
            let post_data = {
                appid: this.APP_ID,
                mch_id: this.MERCHANT_ID,
                device_info,
                nonce_str,
                body,
                out_trade_no,
                total_fee,
                spbill_create_ip,
                notify_url,
                trade_type
            };
            if (option) {
                post_data = Object.assign(post_data, option);
            }
            post_data.sign = this.sign(post_data);
            let result = yield this.http(URL, "POST", this.jsonToXml(post_data));
            return result;
        });
    }
    cancel(out_trade_no) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const URL = "https://api.mch.weixin.qq.com/pay/closeorder";
            let nonce_str = utils_1.randomStr(16);
            let post_data = {
                appid: this.APP_ID,
                mch_id: this.MERCHANT_ID,
                out_trade_no,
                nonce_str
            };
            post_data.sign = this.sign(post_data);
            let result = yield this.http(URL, "POST", this.jsonToXml(post_data));
            return result;
        });
    }
    refund(out_trade_no, out_refund_no, total_fee, option) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this._REFUND_CERT_PATH === null ||
                fs.existsSync(this._REFUND_CERT_PATH)) {
                throw new Error("can not find wechat pay refund cert file.");
            }
            const URL = "https://api.mch.weixin.qq.com/secapi/pay/refund", nonce_str = utils_1.randomStr(16);
            let post_data = {
                appid: this.APP_ID,
                mch_id: this.MERCHANT_ID,
                nonce_str,
                out_trade_no,
                out_refund_no,
                total_fee,
                refund_fee: (option === null || option === void 0 ? void 0 : option.refund_fee) || total_fee
            };
            if (option) {
                post_data = Object.assign(post_data, option);
            }
            post_data.sign = this.sign(post_data);
            let result = yield this.http(URL, "POST", this.jsonToXml(post_data), {
                agentOptions: {
                    pfx: fs.readFileSync(this._REFUND_CERT_PATH),
                    passphrase: this.MERCHANT_ID
                }
            });
            return result;
        });
    }
}
exports.default = WechatPayV2SDK;
//# sourceMappingURL=WechatPayV2.js.map