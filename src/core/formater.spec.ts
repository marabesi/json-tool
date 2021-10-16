import Formatter from './formatter';

describe('json utility tool', () => {
  const formatterBuilder = (json: string) => new Formatter(json);

  test('should format json with two space', async () => {
    const rawJson = '{"a":true,"b":false}';

    const result = await formatterBuilder(rawJson).format();

    expect(result).toMatchSnapshot();
  });
});
