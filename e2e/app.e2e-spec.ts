import { DemoAppPage } from './app.po';

describe('demo-app App', () => {
  let page: DemoAppPage;

  beforeEach(() => {
    page = new DemoAppPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
