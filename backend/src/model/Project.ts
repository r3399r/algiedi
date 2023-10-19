import { ProjectUser } from './entity/ProjectUserEntity';
import { User } from './entity/UserEntity';
import { ViewCreation } from './entity/ViewCreationEntity';
import { ViewCreationExplore } from './entity/ViewCreationExploreEntity';

export type DetailedProject = DetailedCreation & {
  collaborators: (Pick<
    ProjectUser,
    'id' | 'user' | 'role' | 'isAccepted' | 'isReady'
  > & {
    user: User & { avatarUrl: string | null };
    track: DetailedCreation | null;
    lyrics: DetailedCreation | null;
  })[];
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
