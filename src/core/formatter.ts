const fmt2json = require('format-to-json');

export default class Formatter {
  constructor(private rawJson: string) { }

  async format(): Promise<string> {
    const formatted = await fmt2json(this.rawJson, {
      expand: true,
      escape: false,
      indent: 2
    })
    return formatted.result
  }
}