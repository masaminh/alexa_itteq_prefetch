import * as luxon from 'luxon';
import * as formatter from '../lib/formatter';

describe('formatter', (): void => {
  type TestArgs= {
    eventTime: string;
    expectedMessage: string;
  };

  beforeEach(() => {
    luxon.Settings.defaultZone = 'utc';
  });

  test.each`
    eventTime | expectedMessage
    ${'2021-05-01T00:00:00Z'} | ${'今日は20:00から21:00にTITLEがあります。'}
    ${'2021-04-30T23:59:59Z'} | ${'今日は20:00から21:00にTITLEがあります。'}
    ${'2021-04-30T15:00:00Z'} | ${'今日は20:00から21:00にTITLEがあります。'}
    ${'2021-04-30T14:59:59Z'} | ${'今日はイッテQはありませんが、5月1日20:00から21:00にあるようです。'}
  `(
    '5/1に番組がある場合、$eventTime の時のメッセージは「 $expectedMessage 」である',
    ({ eventTime, expectedMessage }: TestArgs) => {
      const actualMessage = formatter.format([{
        date: '5/1', fromtime: '20:00', totime: '21:00', title: 'TITLE',
      }], eventTime);
      expect(actualMessage).toBe(expectedMessage);
    },
  )
})
