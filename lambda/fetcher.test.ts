import puppeteer, { Browser } from 'puppeteer';
import * as fetcher from './fetcher';

jest.mock('puppeteer');
const spyPuppeteerLaunch = jest.spyOn(puppeteer, 'launch');
const mockQuerySelector = jest.fn();
spyPuppeteerLaunch.mockResolvedValue({
  newPage: jest.fn().mockResolvedValue({
    goto: jest.fn(),
    waitForSelector: jest.fn(),
    // eslint-disable-next-line no-unused-vars
    $$eval: jest.fn().mockImplementation((_path: string, func: (_x: any[])=>void) => {
      func([{ querySelector: mockQuerySelector }]);
      return Promise.resolve();
    }),
  }),
  close: jest.fn(),
} as unknown as Browser);

describe('fetcher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetchProgramInfo', async () => {
    mockQuerySelector.mockReturnValue({ textContent: 'TEXT' });
    await fetcher.fetchProgramInfo();
    expect(spyPuppeteerLaunch).toBeCalledTimes(1);
  });

  it('fetchProgramInfo: querySelector returns undefined.', async () => {
    mockQuerySelector.mockReturnValue(undefined);
    await fetcher.fetchProgramInfo();
    expect(spyPuppeteerLaunch).toBeCalledTimes(1);
  });
});
