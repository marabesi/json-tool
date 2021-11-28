export default class CleanUp {

  cleanWhiteSpaces(originalJson: string): string {
    let cleanString = '';
    let stack = [];

    for (let i = 0; i < originalJson.length; i++) {
      const current = originalJson[i];

      if (current === '"') {
        stack.push(current);
      }

      if (stack.length === 3) {
        cleanString += originalJson[i];
      } else {
        if (current !== ' ') {
          cleanString += originalJson[i];
        }
      }

      if (stack.length === 4) {
        stack = [];
      }
    }

    return cleanString;
  }
}