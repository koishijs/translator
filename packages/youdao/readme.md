# koishi-plugin-youdao

[![npm](https://img.shields.io/npm/v/koishi-plugin-youdao?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-youdao)

在 Koishi 中使用 [有道翻译](http://fanyi.youdao.com/)。

## 配置项

### appKey

- 类型: `string`

有道翻译的 App Key。

### secret

- 类型: `string`

有道翻译的 Secret。

## 指令：translate

支持的语言名包括 zh-CHS, en, ja, ko, fr, es, pt, it, ru, vi, de, ar, id, it。

- 基本语法：`translate <text>`
- 选项列表：
  - -f, --from \<lang>  源语言
  - -t, --to \<lang>  目标语言
