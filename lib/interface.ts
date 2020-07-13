export interface WECHAT_BASE_OPTION {
  debug?: boolean;
  refund_cert_path?: string;
  logger?: Function;
}

export interface SESSION_AND_OPEN_ID_RESULT {
  session_key: string;
  open_id: string;
}

export interface BASE_RESULT {
  return_code: string;
  return_msg: string;
  result_code: string;
}

export interface CREATE_ORDER_BASE_RESULT extends BASE_RESULT {
  appid: string;
  mch_id: string;
  device_info: string;
  nonce_str: string;
  sign: string;
  prepay_id: string;
  trade_type: string;
}

export interface CANCEL_ORDER_RESULT extends BASE_RESULT {
  appid: string;
  mch_id: string;
  sub_mch_id: { [propName: string]: any };
  nonce_str: string;
  sign: string;
}

export interface QUERY_ORDER_RESULT extends BASE_RESULT {
  appid: string;
  mch_id: string;
  nonce_str: string;
  sign: string;
  out_trade_no: string;
  attach: { [key: string]: any };
  trade_state: string;
  trade_state_desc: string;
}

export interface REFUND_ORDER_RESULT extends BASE_RESULT {
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

export interface WECHAT_PAY_ORDER_STATUS {
  SUCCESS: string;
  REFUND: string;
  NOTPAY: string;
  CLOSED: string;
  USERPAYING: string;
  [propName: string]: string;
}
