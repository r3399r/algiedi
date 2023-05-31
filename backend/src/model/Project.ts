import { Project } from './entity/Project';
import { ViewCreation } from './entity/ViewCreationEntity';

export type DetailedProject = Project & {
  creation: DetailedCreation[];
};

export type DetailedCreation = ViewCreation & {
  fileUrl: string | null;
  tabFileUrl: string | null;
  coverFileUrl: string | null;
};
