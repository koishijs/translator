import { createHash } from 'crypto'
import { Context, Schema } from 'koishi'
import Translator from '@koishijs/translator'

class BaiduTranslator extends Translator {
  constructor(ctx: Context, public config: BaiduTranslator.Config) {
    super(ctx, config)
  }

  private _signature(query: string, salt: string | number) {
    // https://fanyi-api.baidu.com/doc/21
    const str = this.config.appid + query + salt + this.config.secret
    const md5 = createHash('md5')
    md5.update(str)
    return md5.digest('hex')
  }

  async translate(input: string, options?: Translator.Options): Promise<string> {
    const from = options.source || 'auto'
    const to = options.target || 'zh'
    const salt = new Date().getTime()
    const sign = this._signature(input, salt.toString())

    const resp = await this.ctx.http.post<TranslateResponse | ErrorResponse>(
      'http://api.fanyi.baidu.com/api/trans/vip/translate',
      { from, to, q: input, salt, appid: this.config.appid, sign },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )

    if ('error_code' in resp && +resp.error_code) {
      throw new Error('errorCode: ' + resp.error_code)
    }

    if (!('trans_result' in resp)) {
      throw new Error('invalid response')
    }

    return resp.trans_result[0].dst
  }
}

namespace BaiduTranslator {
  export interface Config extends Translator.Config {
    appid: string
    secret: string
  }

  export const Config: Schema<Config> = Schema.object({
    appid: Schema.string().required().description('百度翻译的 App ID。'),
    secret: Schema.string().role('secret').required().description('百度翻译的 Secret。'),
  })
}

export default BaiduTranslator

interface TranslateResponse {
  from: string
  to: string
  trans_result: TranslateResult[]
}

interface ErrorResponse {
  error_code: string
  error_msg: string
}

interface TranslateResult {
  src: string
  dst: string
}
