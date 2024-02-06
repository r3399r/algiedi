import { SNS } from 'aws-sdk';
import { inject, injectable } from 'inversify';
import {
  PostSnsContactRequest,
  PostSnsSubscribeRequest,
} from 'src/model/api/Sns';

/**
 * Service class for Sns
 */
@injectable()
export class SnsService {
  @inject(SNS)
  private readonly sns!: SNS;

  public async sendContactUs(data: PostSnsContactRequest) {
    return await this.sns
      .publish({
        TopicArn: process.env.SNS_CONTACT_TOPIC_ARN,
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

  public async sendSubscribeNewsletter(data: PostSnsSubscribeRequest) {
    return await this.sns
      .publish({
        TopicArn: process.env.SNS_SUBSCRIBE_TOPIC_ARN,
        Subject: 'GoTron Music Subscribe Newsletter',
        Message: `Subscribe Email: ${data.email}`,
      })
      .promise();
  }
}
