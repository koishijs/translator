import { Context, Service } from 'koishi'

declare module 'koishi' {
  interface Context {
    translator: Translator
  }
}

abstract class Translator extends Service {
  constructor(ctx: Context, public config: Translator.Config) {
    super(ctx, 'translator', true)
  }

  abstract translate(text: string, dest: string, src?: string): Promise<string>
}

namespace Translator {
  export interface Config {}
}

export default Translator
