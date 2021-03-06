import { WechatPayBase } from "./base";
import {
  WECHAT_BASE_OPTION,
  CREATE_ORDER_BASE_RESULT,
  CANCEL_ORDER_RESULT,
  QUERY_ORDER_RESULT,
  REFUND_ORDER_RESULT,
  WECHAT_PAY_ORDER_STATUS
} from "./interface";
import { randomStr, MD5 } from "./utils";
import * as request from "request";
import * as xml2json from "xml2json";
import * as js2xmlparser from "js2xmlparser";
import * as fs from "fs";

export default class WechatPayV2SDK extends WechatPayBase {
  private _REFUND_CERT_PATH: string | null;
  private _WECHAT_PAY_ORDER_STATUS: WECHAT_PAY_ORDER_STATUS = {
    SUCCESS: "SUCCESS",
    REFUND: "REFUND",
    NOTPAY: "NOTPAY",
    CLOSED: "CLOSED",
    USERPAYING: "USERPAYING"
  };

  get WECHAT_PAY_ORDER_STATUS() {
    return this._WECHAT_PAY_ORDER_STATUS;
  }

  constructor(
    app_id: string,
    app_secert: string,
    merchant_id: string,
    merchant_secert: string,
    option: WECHAT_BASE_OPTION
  ) {
    super(app_id, app_secert, merchant_id, merchant_secert, option);
    if (this.DEBUG) {
      this.LOGGER(
        "[ WECHAT PAY V2 ] init with refund cert file path",
        option.refund_cert_path
      );
    }
    this._REFUND_CERT_PATH = option.refund_cert_path || null;
  }

  private async http<T>(
    url: string,
    method: "GET" | "POST",
    body?: any,
    option?: request.CoreOptions
  ): Promise<T> {
    let result = await new Promise<T>((resolve, reject) => {
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
        } else {
          let data: { xml: T } = JSON.parse(xml2json.toJson(body));
          resolve(data.xml);
        }
      });
    }).catch(err => {
      throw err;
    });
    return result;
  }

  private sign(post_data: { [key: string]: any }) {
    const KEYS = Object.keys(post_data).sort();
    let signStr = KEYS.map(key => {
      return `${key}=${post_data[key]}`;
    }).join("&");
    return MD5(`${signStr}&key=${this.MERCHANT_SECRET}`).toUpperCase();
  }

  private jsonToXml(post_data: { [propName: string]: any }) {
    return js2xmlparser.parse("xml", post_data);
  }

  public async create(
    device_info: string,
    body: string,
    out_trade_no: string,
    total_fee: number,
    spbill_create_ip: string,
    notify_url: string,
    trade_type: "JSAPI" | "NATIVE" | "APP" | "MWEB",
    option?: { openid: string }
  ): Promise<CREATE_ORDER_BASE_RESULT> {
    const URL = "https://api.mch.weixin.qq.com/pay/unifiedorder";
    let nonce_str = randomStr(16);
    let post_data: { [propName: string]: any } = {
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
    if (this.DEBUG) {
      this.LOGGER("[ WECHAT PAY V2 ] CREATE with post_data", post_data);
    }
    let result = await this.http<CREATE_ORDER_BASE_RESULT>(
      URL,
      "POST",
      this.jsonToXml(post_data)
    );
    return result;
  }

  public async cancel(out_trade_no: string): Promise<CANCEL_ORDER_RESULT> {
    const URL = "https://api.mch.weixin.qq.com/pay/closeorder";
    let nonce_str = randomStr(16);
    let post_data: { [propName: string]: any } = {
      appid: this.APP_ID,
      mch_id: this.MERCHANT_ID,
      out_trade_no,
      nonce_str
    };
    post_data.sign = this.sign(post_data);
    if (this.DEBUG) {
      this.LOGGER(`[ WECHAT PAY V2 ] CANCEL with post_data`, post_data);
    }
    let result = await this.http<CANCEL_ORDER_RESULT>(
      URL,
      "POST",
      this.jsonToXml(post_data)
    );
    return result;
  }

  public async refund(
    out_trade_no: string,
    out_refund_no: string,
    total_fee: number,
    option?: { refund_desc?: string; refund_fee?: number }
  ): Promise<REFUND_ORDER_RESULT> {
    if (this._REFUND_CERT_PATH === null) {
      throw new Error("can not refund pay without wechat cert file.");
    }
    if (!fs.existsSync(this._REFUND_CERT_PATH)) {
      throw new Error(
        `Can not read refund cert file in path ${this._REFUND_CERT_PATH}`
      );
    }
    const URL = "https://api.mch.weixin.qq.com/secapi/pay/refund",
      nonce_str = randomStr(16);
    let post_data: { [propName: string]: any } = {
      appid: this.APP_ID,
      mch_id: this.MERCHANT_ID,
      nonce_str,
      out_trade_no,
      out_refund_no,
      total_fee,
      refund_fee: option?.refund_fee || total_fee
    };
    if (option) {
      post_data = Object.assign(post_data, option);
    }
    post_data.sign = this.sign(post_data);
    if (this.DEBUG) {
      this.LOGGER("[ WECHAT PAY V2 ]REFUND with post_data", post_data);
    }
    let result = await this.http<REFUND_ORDER_RESULT>(
      URL,
      "POST",
      this.jsonToXml(post_data),
      {
        agentOptions: {
          pfx: fs.readFileSync(this._REFUND_CERT_PATH!),
          passphrase: this.MERCHANT_ID
        }
      }
    );
    return result;
  }

  public async query(out_trade_no: string) {
    const URL = "https://api.mch.weixin.qq.com/pay/orderquery",
      nonce_str = randomStr(16);
    let post_data: { [propName: string]: any } = {
      appid: this.APP_ID,
      mch_id: this.MERCHANT_ID,
      out_trade_no,
      nonce_str
    };
    post_data.sign = this.sign(post_data);
    if (this.DEBUG) {
      this.LOGGER("[ WECHAT PAY V2 ] QUERY with post_data", post_data);
    }
    let result = await this.http<QUERY_ORDER_RESULT>(
      URL,
      "POST",
      this.jsonToXml(post_data)
    );
    return result;
  }

  public getMiniprogramSign(data: { [key: string]: any }): string {
    let post_data = Object.assign(data, { appId: this.APP_ID });
    if (this.DEBUG) {
      this.LOGGER(
        "[ WECHAT PAY V2 ] Get miniprogram pay sign with data",
        post_data
      );
    }
    return this.sign(post_data);
  }
}
