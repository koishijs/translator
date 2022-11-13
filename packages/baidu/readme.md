# koishi-plugin-translator-baidu

[![npm](https://img.shields.io/npm/v/koishi-plugin-baidu?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-translator-baidu)

在 Koishi 中使用 [百度翻译](https://fanyi.baidu.com/)。

## 配置项

### appid

- 类型: `string`

百度翻译的 AppID。

### secret

- 类型: `string`

百度翻译的 Secret。

## 指令：translate

支持的语言名包括 zh, en, yue, wyw, jp, kor, fra, spa, th, ara, ru, pt, de, it, el, nl, pl, bul, est, dan, fin, cs, rom, slo, swe, hu, cht, vie。

- 基本语法：`translate <text>`
- 选项列表：
  - -f, --from \<lang>  源语言
  - -t, --to \<lang>  目标语言
