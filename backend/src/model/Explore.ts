import { Role } from './constant/Project';
import { Info } from './entity/InfoEntity';
import { User } from './entity/UserEntity';
import { ViewCreationExplore } from './entity/ViewCreationExploreEntity';

export type ExploreCreation = Omit<ViewCreationExplore, 'user' | 'info'> & {
  fileUrl: string | null;
  tabFileUrl: string | null;
  user: (User & { projectRole: Role; avatarUrl: string | null })[];
  info: Info & { coverFileUrl: string | null };
};

export type ExploreUser = User & {
  avatarUrl: string | null;
};
