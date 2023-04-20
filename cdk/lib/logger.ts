import bunyan from 'bunyan';

const logger = bunyan.createLogger({ name: 'AlexaItteqPrefetch' });
logger.level(bunyan.DEBUG);

export function error(message: string): void {
  logger.error(message);
}

export function info(message: string): void {
  logger.info(message);
}

export function debug(message: string): void {
  logger.debug(message);
}
