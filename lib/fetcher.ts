import Chromium from 'chrome-aws-lambda';

/* global Element */

export interface ProgramInfo {
  date: string;
  fromtime: string;
  totime: string;
  title: string;
}

// 最後のa=10が札幌を示している
const Url = 'https://tv.yahoo.co.jp/search/?q=%E3%82%A4%E3%83%83%E3%83%86Q&a=10';

export const fetchProgramInfo = async (): Promise<ProgramInfo[]> => {
  const browser = await Chromium.puppeteer.launch({
    args: Chromium.args,
    defaultViewport: Chromium.defaultViewport,
    executablePath: await Chromium.executablePath,
    headless: Chromium.headless,
    ignoreHTTPSErrors: true,
  });

  try {
    const page = await browser.newPage();
    await page.goto(Url);
    await page.waitForSelector('.programListItem');
    return await page.$$eval('.programListItem', (list) => list.map((e): ProgramInfo => {
      const getTextContent = (x: Element, selector: string): string => x.querySelector(selector)?.textContent ?? ''

      const date = getTextContent(e, 'time.scheduleText:first-of-type > span:first-of-type');
      const fromtime = getTextContent(e, 'time.scheduleText:first-of-type > span:nth-of-type(3)');
      const totime = getTextContent(e, 'span.scheduleTextTimeEnd');
      const title = getTextContent(e, 'a.programListItemTitleLink');

      return {
        date, fromtime, totime, title,
      };
    }));
  } finally {
    await browser.close();
  }
}
