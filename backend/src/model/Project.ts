import { Info } from './entity/InfoEntity';
import { ProjectUser } from './entity/ProjectUserEntity';
import { User } from './entity/UserEntity';
import { ViewCreation } from './entity/ViewCreationEntity';

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

export type DetailedCreation = Omit<ViewCreation, 'info'> & {
  fileUrl: string | null;
  tabFileUrl: string | null;
  info: Info & { coverFileUrl: string | null };
};
