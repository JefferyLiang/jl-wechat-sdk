declare class WechatMiniprogramSdk {
  public getOpenIdAndSessionKey(
    code: string
  ): Promise<{
    session_key: string;
    open_id: string;
  }>;
}

interface BASE_RESULT {
  return_code: string;
  return_msg: string;
  result_code: string;
}

interface CREATE_ORDER_BASE_RESULT extends BASE_RESULT {
  appid: string;
  mch_id: string;
  device_info: string;
  nonce_str: string;
  sign: string;
  prepay_id: string;
  trade_type: string;
}

interface CANCEL_ORDER_RESULT extends BASE_RESULT {
  appid: string;
  mch_id: string;
  sub_mch_id: { [propName: string]: any };
  nonce_str: string;
  sign: string;
}

interface WECHAT_BASE_OPTION {
  debug?: boolean;
  refund_cert_path?: string;
}

interface QUERY_ORDER_RESULT extends BASE_RESULT {
  appid: string;
  mch_id: string;
  nonce_str: string;
  sign: string;
  out_trade_no: string;
  attach: { [key: string]: any };
  trade_state: string;
  trade_state_desc: string;
}

interface REFUND_ORDER_RESULT extends BASE_RESULT {
  appid: string;
  mch_id: string;
  nonce_str: string;
  sign: string;
  transaction_id: string;
  out_trade_no: string;
  out_refund_no: string;
  refund_id: string;
  refund_channel: { [key: string]: any };
  refund_fee: string;
  coupon_refund_fee: string;
  total_fee: string;
  cash_fee: string;
  coupon_refund_count: string;
  cash_refund_fee: string;
}

interface WECHAT_PAY_ORDER_STATUS {
  SUCCESS: string;
  REFUND: string;
  NOTPAY: string;
  CLOSED: string;
  USERPAYING: string;
  [propName: string]: string;
}

declare class WechatPayV2 {
  constructor(
    app_id: string,
    app_secret: string,
    merchant_id: string,
    merchant_secert: string,
    option: WECHAT_BASE_OPTION
  );

  get WECHAT_PAY_ORDER_STATUS(): WECHAT_PAY_ORDER_STATUS;

  public create(
    device_info: string,
    body: string,
    out_trade_no: string,
    total_fee: number,
    spbill_create_ip: string,
    notify_url: string,
    trade_type: "JSAPI" | "NATIVE" | "APP" | "MWEB",
    option?: { openid: string }
  ): Promise<CREATE_ORDER_BASE_RESULT>;

  public cancel(out_trade_no: string): Promise<CANCEL_ORDER_RESULT>;

  public refund(
    out_trade_no: string,
    out_refund_no: string,
    total_fee: number,
    option?: { refund_desc?: string; refund_fee?: number }
  ): Promise<REFUND_ORDER_RESULT>;

  public query(out_trade_no: string): Promise<QUERY_ORDER_RESULT>;

  public getMiniprogramSign(data: { [key: string]: any }): string;
}

declare class WechatSdk {
  get MiniprogramSdk(): WechatMiniprogramSdk;
  get WechatPayV2(): WechatPayV2;

  constructor(
    app_id: string,
    app_secret: string,
    option: {
      debug?: boolean;
      refund_cert_path?: string;
      logger?: Function;
    },
    merchant_id?: string,
    merchant_sercert?: string
  );
}

export default WechatSdk;
