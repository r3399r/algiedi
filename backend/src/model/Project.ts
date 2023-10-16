import { Role } from './constant/Project';
import { Project } from './entity/ProjectEntity';
import { User } from './entity/UserEntity';
import { ViewCreation } from './entity/ViewCreationEntity';
import { ViewCreationExplore } from './entity/ViewCreationExploreEntity';

export type DetailedProject = Project & {
  name: string | null;
  description: string | null;
  theme: string | null;
  genre: string | null;
  language: string | null;
  caption: string | null;
  coverFileUri: string | null;
  coverFileUrl: string | null;
  song: DetailedCreation | null;
  collaborators: {
    id: string;
    user: User & { avatarUrl: string | null };
    role: Role;
    isAccepted: boolean | null;
    isReady: boolean | null;
    track: DetailedCreation | null;
    lyrics: DetailedCreation | null;
  }[];
};

export type DetailedCreation = ViewCreation & {
  fileUrl: string | null;
  tabFileUrl: string | null;
  coverFileUrl: string | null;
};

export type ExtendedCreation = ViewCreationExplore & {
  fileUrl: string | null;
  tabFileUrl: string | null;
  coverFileUrl: string | null;
};
