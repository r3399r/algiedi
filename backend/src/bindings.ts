import 'reflect-metadata';
import { SNS } from 'aws-sdk';
import { Container } from 'inversify';
import { SnsService } from './logic/SnsService';
import { VariableService } from './logic/VariableService';

const container: Container = new Container();

// service
container.bind<SnsService>(SnsService).toSelf();
container.bind<VariableService>(VariableService).toSelf();

// AWS
container.bind<SNS>(SNS).toDynamicValue(() => new SNS());

export { container as bindings };
