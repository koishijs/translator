import { createHash } from 'crypto'
import { Context, Schema } from 'koishi'
import Translator from '@koishijs/translator'

function encrypt(source: string) {
  return createHash('md5').update(source).digest('hex') // lgtm [js/weak-cryptographic-algorithm]
}

class YoudaoTranslator extends Translator {
  constructor(ctx: Context, public config: YoudaoTranslator.Config) {
    super(ctx, config)
  }

  async translate(input: string, options?: Translator.Options) {
    const { appKey, secret } = this.config
    const salt = new Date().getTime()
    const q = input
    // 虽然文档中写了超过 20 字符的处理方法, 实测如果按照文档反而无法通过校验
    // const qShort = q.length > 20 ? q.slice(0, 10) + q.length + q.slice(-10) : q
    const from = options.source || ''
    const to = options.target || 'zh-CHS'
    const sign = encrypt(appKey + q + salt + secret)
    const data = await this.ctx.http.get('http://openapi.youdao.com/api', {
      params: { q, appKey, salt, from, to, sign },
    })

    if (+data.errorCode) {
      throw new Error('errorCode: ' + data.errorCode)
    }

    const output: string[] = data.translation
    if (options.detail && data.basic) {
      if (data.basic.phonetic) {
        output.push(data.basic.phonetic)
      }
      output.push(...data.basic.explains)
    }
    return output.join('\n')
  }
}

namespace YoudaoTranslator {
  export interface Config extends Translator.Config {
    appKey?: string
    secret?: string
  }

  export const Config: Schema<Config> = Schema.object({
    appKey: Schema.string().required().description('有道翻译的 App Key。'),
    secret: Schema.string().role('secret').required().description('有道翻译的 Secret。'),
  })
}

export default YoudaoTranslator
