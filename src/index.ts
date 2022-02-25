import { createHash } from 'crypto'
import { Context, Dict, Schema } from 'koishi'

const languages: Dict<string> = {
  'zh-CHS': '中文',
  'en': '英文',
  'ja': '日文',
  'ko': '韩文',
  'fr': '法文',
  'es': '西班牙文',
  'pt': '葡萄牙文',
  'it': '意大利文',
  'ru': '俄文',
  'vi': '越南文',
  'de': '德文',
  'ar': '阿拉伯文',
  'id': '印尼文',
}

export interface Config {
  appKey?: string
  secret?: string
}

export const Config: Schema<Config> = Schema.object({
  appKey: Schema.string().required().description('有道翻译的 App Key。'),
  secret: Schema.string().role('secret').required().description('有道翻译的 Secret。'),
})

function encrypt(source: string) {
  return createHash('md5').update(source).digest('hex') // lgtm [js/weak-cryptographic-algorithm]
}

export const name = 'translate'

export function apply(ctx: Context, { appKey, secret }: Config) {
  ctx.command('translate <text>', '翻译工具')
    .option('from', '-f <lang>  指定源语言，默认为自动匹配', { fallback: '' })
    .option('to', '-t <lang>  指定目标语言，默认为中文', { fallback: 'zh-CHS' })
    .usage('支持的语言名包括 zh-CHS, en, ja, ko, fr, es, pt, it, ru, vi, de, ar, id, it。')
    .action(async ({ options }, text) => {
      if (!text) return
      const salt = new Date().getTime()
      const q = String(text)
      const qShort = q.length > 20 ? q.slice(0, 10) + q.length + q.slice(-10) : q
      const from = options.from
      const to = options.to
      const sign = encrypt(appKey + qShort + salt + secret)
      const data = await ctx.http.get('http://openapi.youdao.com/api', {
        params: { q, appKey, salt, from, to, sign },
      })

      if (Number(data.errorCode)) return `翻译失败，错误码：${data.errorCode}`

      const [source, target] = data.l.split('2')
      const output = [
        `原文本：${data.query}`,
        `语言：${languages[source]} -> ${languages[target]}`,
        `翻译结果：${data.translation.join('\n')}`,
      ]
      if (data.basic) {
        if (data.basic.phonetic) {
          output.push(data.basic.phonetic)
        }
        output.push(...data.basic.explains)
      }
      return output.join('\n')
    })
}
