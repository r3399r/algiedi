import { Project } from './entity/ProjectEntity';
import { ViewCreation } from './entity/ViewCreationEntity';

export type DetailedProject = Project & {
  mainTrack: DetailedCreation | null;
  mainLyrics: DetailedCreation | null;
  inspiration: DetailedCreation[];
};

export type DetailedCreation = ViewCreation & {
  fileUrl: string | null;
  tabFileUrl: string | null;
  coverFileUrl: string | null;
};
