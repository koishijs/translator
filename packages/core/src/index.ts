import { Context, Service } from 'koishi'

declare module 'koishi' {
  interface Context {
    translator: Translator
  }
}

abstract class Translator<C extends Translator.Config = Translator.Config> extends Service {
  constructor(ctx: Context, public config: C) {
    super(ctx, 'translator', true)

    ctx.i18n.define('zh-CN', require('./locales/zh-CN'))

    ctx.command('translate <text:text>')
      .userFields(['locales'])
      .channelFields(['locales'])
      .option('source', '-s <lang>')
      .option('target', '-t <lang>')
      .action(async ({ options, session }, input) => {
        if (!input) return session.text('.expect-input')

        const { source, target } = options
        const result: Translator.Result = { input, source, target, detail: true }
        result.output = await this.translate(result)
        return session.text('.output', result)
      })
  }

  abstract translate(options?: Translator.Result): Promise<string>
}

namespace Translator {
  export interface Config {}

  export interface Result {
    input: string
    output?: string
    source?: string
    target?: string
    detail?: boolean
  }
}

export default Translator
