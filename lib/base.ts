import { WECHAT_BASE_OPTION } from "./interface";

export class WechatBase {
  private _APP_ID: string;
  private _APP_SECRET: string;
  private _DEBUG: boolean;

  get APP_ID() {
    return this._APP_ID;
  }

  get APP_SECRET() {
    return this._APP_SECRET;
  }

  get DEBUG() {
    return this._DEBUG;
  }

  constructor(
    app_id: string,
    app_secret: string,
    option: WECHAT_BASE_OPTION = {}
  ) {
    this._APP_ID = app_id;
    this._APP_SECRET = app_secret;
    this._DEBUG = option.debug || false;
  }
}

export class WechatPayBase extends WechatBase {
  private _MERCHANT_ID: string;
  private _MERCHANT_SECRET: string;

  get MERCHANT_ID() {
    return this._MERCHANT_ID;
  }

  get MERCHANT_SECRET() {
    return this._MERCHANT_SECRET;
  }

  constructor(
    app_id: string,
    app_secert: string,
    merchant_id: string,
    merchant_secert: string,
    option: { debug?: boolean }
  ) {
    super(app_id, app_secert, option);
    this._MERCHANT_ID = merchant_id;
    this._MERCHANT_SECRET = merchant_secert;
    if (this.DEBUG) {
      console.log(
        `[WECHAT PAY V2 SDK] init with app_id: ${this.APP_ID}, app_secert: ${this.APP_SECRET}, merchant_id: ${this.MERCHANT_ID}, merchant_secert: ${this.MERCHANT_SECRET}`
      );
    }
  }
}
