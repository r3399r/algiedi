// import { SNS } from 'aws-sdk';
import { inject, injectable } from 'inversify';
import { DbAccess } from 'src/access/DbAccess';
import { ProjectAccess } from 'src/access/ProjectAccess';
import { PostSnsRequest } from 'src/model/api/Sns';
import { ProjectEntity } from 'src/model/entity/ProjectEntity';

/**
 * Service class for Sns
 */
@injectable()
export class SnsService {
  // @inject(SNS)
  // private readonly sns!: SNS;

  @inject(DbAccess)
  private readonly dbAccess!: DbAccess;

  @inject(ProjectAccess)
  private readonly projectAccess!: ProjectAccess;

  public async sendSns(_data: PostSnsRequest) {
    // console.log(data)
    const project = new ProjectEntity();
    project.name = 'hi';
    await this.projectAccess.save(project);

    const res = await this.projectAccess.find();
    console.log(res);
    await this.dbAccess.cleanup();
    console.log('done');
    // return await this.sns
    //   .publish({
    //     TopicArn: process.env.SNS_TOPIC_ARN,
    //     Subject: 'GoTron Music General Enquiry',
    //     Message: [
    //       `First name: ${data.firstName}`,
    //       `Surname: ${data.surname}`,
    //       `Email: ${data.email}`,
    //       'Message:',
    //       data.message,
    //     ].join('\n'),
    //   })
    //   .promise();
  }
}
