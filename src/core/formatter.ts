const fmt2json = require('format-to-json');

export default class Formatter {
  constructor(private rawJson: string, private spacing: number = 2) { }

  async format(): Promise<string> {
    const formatted = await fmt2json(this.rawJson, {
      expand: true,
      escape: false,
      indent: this.spacing
    });
    return formatted.result;
  }
}
