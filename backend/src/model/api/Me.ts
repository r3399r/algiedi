import { Info } from 'src/model/entity/InfoEntity';
import { Project } from 'src/model/entity/ProjectEntity';
import { User } from 'src/model/entity/UserEntity';
import { PaginationParams } from 'src/model/Pagination';

export type GetMeResponse = User & { avatarUrl: string | null };

export type PutMeRequest = {
  role?: string;
  language?: string;
  bio?: string;
  age?: string;
  tag?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  soundcloud?: string;
};

export type PutMeResponse = User & { avatarUrl: string | null };

export type GetMeExhibitsPublishedParams = PaginationParams;

export type GetMeExhibitsPublishedResponse = (Omit<Project, 'info'> & {
  info: Info & { coverFileUrl: string | null };
})[];
