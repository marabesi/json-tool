import { Blob } from 'buffer';

export function setUpClipboard(json: string) {
  Object.assign(global.navigator,
    {
      clipboard: {
        async writeText(text: string) {
          return text;
        },
        async read() {
          const blob = new Blob([json], { type: 'text/plain' });

          return Promise.resolve([
            {
              [blob.type]: blob,
              types: [ blob.type ],
              getType: () => blob
            }
          ]);
        }
      }
    });
}

export function tearDownClipboard() {
  Object.assign(global.navigator, {
    clipboard: null
  });
}
