import * as logger from './logger';

jest.mock('bunyan', () => ({
  createLogger: () => ({
    level: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  }),
}));

describe('logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('エラーなきことの確認', () => {
    // 本当はちゃんとbunyan.errorとかが呼ばれている確認が必要だけど、
    // Loggerをimport時に静的に持ってしまっているのでテストがしんどい
    // 関数構成変えるタイミングでちゃんとテストする
    logger.error('ABC');
    logger.info('ABC');
    logger.debug('ABC');
  })
});
