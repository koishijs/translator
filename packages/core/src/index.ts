import { Context, Service } from 'koishi'
import zh from './locales/zh.yml'

declare module 'koishi' {
  interface Context {
    translator: Translator
  }
}

abstract class Translator extends Service {
  constructor(ctx: Context, public config: Translator.Config) {
    super(ctx, 'translator', true)

    ctx.i18n.define('zh', zh)

    ctx.command('translate <text:text>')
      .option('source', '-s <lang>')
      .option('target', '-t <lang>')
      .action(async ({ options, session }, input) => {
        if (!input) return session.text('.expect-input')

        const { source, target } = options
        const output = this.translate('' + input, { source, target, detail: true })
        return session.text('.output', { input, output, source, target })
      })
  }

  abstract translate(input: string, options?: Translator.Options): Promise<string>
}

namespace Translator {
  export interface Config {}

  export interface Options {
    source?: string
    target?: string
    detail?: boolean
  }
}

export default Translator
