import { S3 } from 'aws-sdk';
import { inject, injectable } from 'inversify';

/**
 * Service class for Aws
 */
@injectable()
export class AwsService {
  @inject(S3)
  private readonly s3!: S3;

  public getS3SignedUrl(uri: string | null) {
    const bucket = `${process.env.PROJECT}-${process.env.ENVR}-storage`;

    return uri === null
      ? null
      : this.s3.getSignedUrl('getObject', {
          Bucket: bucket,
          Key: uri,
        });
  }

  public async s3Upload(data: string, filename: string) {
    const buffer = Buffer.from(data, 'base64');
    // workaround for ES module
    const { fileTypeFromBuffer } = require('file-type'); // eslint-disable-line
    const res = await fileTypeFromBuffer(buffer);
    const bucket = `${process.env.PROJECT}-${process.env.ENVR}-storage`;
    const key = `${filename}.${res?.ext}`;

    await this.s3
      .putObject({
        Body: buffer,
        Bucket: bucket,
        Key: key,
      })
      .promise();

    return key;
  }
}
