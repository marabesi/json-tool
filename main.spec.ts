import path from 'path'
import {Application} from 'spectron'
import { setupBrowser } from '@testing-library/webdriverio'

const app: Application = new Application({
  path: path.resolve(`${__dirname}/../out/json-tool-linux-x64/json-tool`),
  port: 9157
})

describe('Application launch', function () {
  afterEach(async ()=> {
    await app.stop()
  })

  test('label to place the json string', async () => {
    await app.start()
    // @ts-ignore
    const { findByText } = setupBrowser(app.client);
    await findByText("format");
  })
})
