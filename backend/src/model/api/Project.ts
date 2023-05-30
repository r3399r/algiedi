import { DetailedProject } from 'src/model/Project';

export type GetProjectResponse = DetailedProject[];

export type PutProjectRequest = {
  name?: string;
  description?: string;
  theme?: string;
  genre?: string;
  language?: string;
  caption?: string;
};

export type PutProjectIdCoverRequest = {
  file: string;
};
