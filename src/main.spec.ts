import {Application} from 'spectron'
// @ts-ignore
import { setupBrowser } from '@testing-library/webdriverio'

const app: Application = new Application({
  path: '/home/marabesi/Documents/json-utility-tool/node_modules/electron/dist/electron',
  port: 9157
})

describe('Application launch', function () {
  test('validate json', async () => {
    await app.start()

    try {
      // @ts-ignore
      const { getByRole } = setupBrowser(app.client);
      await getByRole("textarea", { name: /Hello/i });
    } catch (error) {
      console.error(error.message)
    }

    await app.stop()
  })
})
