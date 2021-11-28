export default class CleanUp {

  private IS_INSIDE_JSON_VALUE: number = 3;
  private ENDED_JSON_PAIR_KEY_VALUE: number = 4;

  cleanWhiteSpaces(originalJson: string): string {
    let cleanString = '';
    let stack = [];

    for (let i = 0; i < originalJson.length; i++) {
      const current = originalJson[i];

      if (current === '"') {
        stack.push(current);
      }

      if (stack.length === this.IS_INSIDE_JSON_VALUE) {
        cleanString += originalJson[i];
      } else {
        if (current !== ' ') {
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