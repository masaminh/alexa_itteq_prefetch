import * as lambda from 'aws-lambda';
import AWSSDK from 'aws-sdk';
import * as fetcher from './fetcher';
import * as formatter from './formatter';
import * as logger from './logger';

export const handler: lambda.ScheduledHandler = async (event) => {
  logger.info(`Start. event: ${JSON.stringify(event)}`);

  const fetchResult = await fetcher.fetchProgramInfo();
  const message = formatter.format(fetchResult, event.time);

  const bucket = process.env.SPEECH_TEXT_BUCKET ?? '';
  const key = process.env.SPEECH_TEXT_KEY ?? '';
  const s3 = new AWSSDK.S3();
  await s3.putObject({ Bucket: bucket, Key: key, Body: message }).promise();

  logger.info(`End. message: ${message}`);
};
