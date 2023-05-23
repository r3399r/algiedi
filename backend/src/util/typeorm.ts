import { ValueTransformer } from 'typeorm';

export const booleanTransformer: ValueTransformer = {
  to(value: boolean) {
    return Number(value);
  },
  from(value: 0 | 1) {
    return Boolean(value);
  },
};
