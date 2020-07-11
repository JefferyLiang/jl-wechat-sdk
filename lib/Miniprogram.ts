import { WechatBase } from "./base";
import { WECHAT_BASE_OPTION, SESSION_AND_OPEN_ID_RESULT } from "./interface";
import * as request from "request";

export class WechatMiniprogramSdk extends WechatBase {
  constructor(
    app_id: string,
    app_secret: string,
    option: WECHAT_BASE_OPTION = {}
  ) {
    super(app_id, app_secret, option);
    if (this.DEBUG) {
      console.log(
        `[Wechat Miniprogram SDK] init with id: ${this.APP_ID}, secret: ${this.APP_SECRET} now`
      );
    }
  }

  public async getOpenIdAndSessionKey(
    code: string
  ): Promise<SESSION_AND_OPEN_ID_RESULT> {
    const URL = `https://api.weixin.qq.com/sns/jscode2session?appid=${this.APP_ID}&secret=${this.APP_SECRET}&js_code=${code}&grant_type=authorization_code`;
    let result = await new Promise<SESSION_AND_OPEN_ID_RESULT>(
      (resolve, reject) => {
        request(
          {
            url: URL,
            method: "GET"
          },
          (err, responnse, body) => {
            if (err) {
              reject(err);
            } else {
              resolve(body);
            }
          }
        );
      }
    ).catch(err => {
      throw err;
    });
    return result;
  }
}
