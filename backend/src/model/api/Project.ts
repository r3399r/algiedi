import { CombinedProject } from 'src/model/Project';

export type GetProjectResponse = CombinedProject[];

export type PutProjectRequest = {
  name?: string;
  description?: string;
  theme?: string;
  genre?: string;
  language?: string;
  caption?: string;
};
