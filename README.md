# AlexaItteqPrefetch

## 準備

### Lambdaレイヤ

chrome-aws-lambdaをLambdaレイヤとして用意しておく。

### パラメータストア
以下のパラメータをパラメータストア上に用意しておく。

| パラメータ名 | パラメータ値 |
|:-----------|:-----------|
|/ステージ名/AlexaItteqPrefetch/ChromeAwsLambdaArn|chrome-aws-lambdaのLambdaレイヤのARN|
|/ステージ名/AlexaItteqPrefetch/SpeechTextBucket|発話メッセージ格納先S3バケット名|
|/ステージ名/AlexaItteqPrefetch/SpeechTextKey|発話メッセージ格納先S3バケット上のキー|

## デプロイ

```
cdk deploy -c stage=ステージ名 --profile プロファイル名
```
