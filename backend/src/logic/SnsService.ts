import { SNS } from 'aws-sdk';
import { inject, injectable } from 'inversify';
import { PostSnsRequest } from 'src/model/api/Sns';

/**
 * Service class for Sns
 */
@injectable()
export class SnsService {
  @inject(SNS)
  private readonly sns!: SNS;

  public async sendSns(data: PostSnsRequest) {
    return await this.sns
      .publish({
        TopicArn: process.env.SNS_TOPIC_ARN,
        Subject: 'GoTron Music General Enquiry',
        Message: [
          `First name: ${data.firstName}`,
          `Surname: ${data.surname}`,
          `Email: ${data.email}`,
          'Message:',
          data.message,
        ].join('\n'),
      })
      .promise();
  }
}
