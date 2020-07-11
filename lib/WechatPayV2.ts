import { WechatPayBase } from "./base";
import {
  WECHAT_BASE_OPTION,
  CREATE_ORDER_BASE_RESULT,
  CANCEL_ORDER_RESULT,
  QUERY_ORDER_RESULT
} from "./interface";
import { randomStr, MD5 } from "./utils";
import * as request from "request";
import * as xml2json from "xml2json";
import * as js2xmlparser from "js2xmlparser";
import * as fs from "fs";

export default class WechatPayV2SDK extends WechatPayBase {
  private _REFUND_CERT_PATH: string | null;

  constructor(
    app_id: string,
    app_secert: string,
    merchant_id: string,
    merchant_secert: string,
    option: WECHAT_BASE_OPTION
  ) {
    super(app_id, app_secert, merchant_id, merchant_secert, option);
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
    const KEYS = Object.keys(post_data);
    let signStr =
      KEYS.map(key => {
        return `${key}=${post_data[key]}`;
      }).join("&") + `&key=${this.MERCHANT_SECRET}`;
    return MD5(signStr).toUpperCase();
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
    option?: { refund_desc: string; refund_fee: number }
  ): Promise<any> {
    if (
      this._REFUND_CERT_PATH === null ||
      fs.existsSync(this._REFUND_CERT_PATH)
    ) {
      throw new Error("can not find wechat pay refund cert file.");
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
    let result = await this.http<any>(URL, "POST", this.jsonToXml(post_data), {
      agentOptions: {
        pfx: fs.readFileSync(this._REFUND_CERT_PATH!),
        passphrase: this.MERCHANT_ID
      }
    });
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
    let result = await this.http<QUERY_ORDER_RESULT>(
      URL,
      "POST",
      this.jsonToXml(post_data)
    );
    return result;
  }
}
