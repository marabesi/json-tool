export default class CleanUp {

  private IS_INSIDE_JSON_VALUE: number = 3;
  private ENDED_JSON_PAIR_KEY_VALUE: number = 4;
  private STARTED_INSIDE_JSON_KEY: number = 1;
  private DOUBLE_QUOTES: string = '"';

  cleanWhiteSpaces(originalJson: string): string {
    return this.cleanUpJsonFrom(' ', originalJson);
  }

  cleanNewLines(originalJson: string): string {
    return this.cleanUpJsonFrom('\n', originalJson);
  }

  cleanWhiteSpacesAndNewLines(originalJson: string): string {
    const withoutSpaces = this.cleanWhiteSpaces(originalJson);
    return this.cleanNewLines(withoutSpaces);
  }

  private cleanUpJsonFrom(stringToClean: string, originalJson: string) {
    let cleanString = '';
    let stack = [];

    for (let i = 0; i < originalJson.length; i++) {
      const current = originalJson[i];

      if (current === this.DOUBLE_QUOTES) {
        stack.push(current);
      }

      if (stack.length === this.STARTED_INSIDE_JSON_KEY || stack.length === this.IS_INSIDE_JSON_VALUE) {
        cleanString += originalJson[i];
      } else {
        if (current !== stringToClean) {
          cleanString += originalJson[i];
        }
      }

      if (stack.length === this.ENDED_JSON_PAIR_KEY_VALUE) {
        stack = [];
      }
    }

    return cleanString;
  }
}