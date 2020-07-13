import { WechatBase } from "./base";
import { WECHAT_BASE_OPTION } from "./interface";
import { WechatMiniprogramSdk } from "./Miniprogram";
import WechatPayV2 from "./WechatPayV2";

export default class WechatSdk extends WechatBase {
  private _MERCHANT_ID: string | null;
  private _MERCHANT_SECERT: string | null;
  private _REFUND_CERT_PATH?: string;

  private _MiniprogramSdk: WechatMiniprogramSdk | null = null;
  private _WechatPayV2: WechatPayV2 | null = null;

  get MiniprogramSdk() {
    if (this._MiniprogramSdk === null) {
      this._MiniprogramSdk = new WechatMiniprogramSdk(
        this.APP_ID,
        this.APP_SECRET,
        {
          debug: this.DEBUG
        }
      );
    }
    return this._MiniprogramSdk;
  }

  get WechatPayV2() {
    if (this._WechatPayV2 === null) {
      if (this._MERCHANT_ID === null || this._MERCHANT_SECERT === null) {
        throw new Error(
          "can not init wechat pay sdk without merchant_id or merchant_serect"
        );
      }
      this._WechatPayV2 = new WechatPayV2(
        this.APP_ID,
        this.APP_SECRET,
        this._MERCHANT_ID,
        this._MERCHANT_SECERT,
        {
          debug: this.DEBUG,
          refund_cert_path: this._REFUND_CERT_PATH
        }
      );
    }
    return this._WechatPayV2;
  }

  constructor(
    app_id: string,
    app_secret: string,
    option: WECHAT_BASE_OPTION = {},
    merchant_id?: string,
    merchant_sercert?: string
  ) {
    super(app_id, app_secret, option);
    this._MERCHANT_ID = merchant_id || null;
    this._MERCHANT_SECERT = merchant_sercert || null;
    this._REFUND_CERT_PATH = option?.refund_cert_path;
    if (this.DEBUG) {
      this.LOGGER(
        `[WECHAT SDK] init with id: ${this.APP_ID}, secret: ${this.APP_SECRET} now`
      );
    }
  }
}
