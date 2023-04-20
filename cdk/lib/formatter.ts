import * as luxon from 'luxon';
import * as fetcher from './fetcher';

export const format = (fetchResult: fetcher.ProgramInfo[], isotime: string): string => {
  const timestamp = luxon.DateTime.fromISO(isotime).setZone('Asia/Tokyo');
  const date = timestamp.toFormat('M/d');
  const filtered = fetchResult.filter((x) => x.date === date);

  if (filtered.length > 0) {
    // 今日ある場合は、番組詳細まで返す
    const subStr = filtered
      .map((x) => {
        const result = `${x.fromtime}から${x.totime}に${x.title}が`;
        return result;
      })
      .join('、');
    return `今日は${subStr}あります。`;
  }

  if (fetchResult.length > 0) {
    // 今日はないけど、明日以降見つかったら、日付と時刻を返す。
    const subStr = fetchResult
      .map((x) => `${x.date.replace('/', '月')}日${x.fromtime}から${x.totime}`)
      .join('と、');
    return `今日はイッテQはありませんが、${subStr}にあるようです。`;
  }

  // ない
  return '今日はイッテQはありません。';
}
