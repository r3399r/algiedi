import { SNS } from 'aws-sdk';
import { Container } from 'inversify';
import 'reflect-metadata';
import { SnsService } from './logic/SnsService';

const container: Container = new Container();

// service
container.bind<SnsService>(SnsService).toSelf();

// AWS
container.bind<SNS>(SNS).toDynamicValue(() => new SNS());

export { container as bindings };
