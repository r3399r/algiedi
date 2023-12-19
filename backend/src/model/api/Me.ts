import { Follow } from 'src/model/entity/FollowEntity';
import { Like } from 'src/model/entity/LikeEntity';
import { User } from 'src/model/entity/UserEntity';
import { ExploreCreation, ExploreUser } from 'src/model/Explore';
import { PaginationParams } from 'src/model/Pagination';

export type GetMeResponse = User & { avatarUrl: string | null };

export type PutMeRequest = {
  role?: string;
  language?: string;
  bio?: string;
  age?: string;
  region?: string;
  tag?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  soundcloud?: string;
};

export type PutMeResponse = User & { avatarUrl: string | null };

export type GetMeExhibitsPublishedParams = PaginationParams;

export type GetMeExhibitsPublishedResponse = ExploreCreation[];

export type GetMeExhibitsOriginalPramas = PaginationParams & {
  type?: string;
};

export type GetMeExhibitsOriginalResponse = ExploreCreation[];

export type GetMeExhibitsInspirationPramas = PaginationParams & {
  type?: string;
};

export type GetMeExhibitsInspirationResponse = ExploreCreation[];

export type GetMeExhibitsLikeParams = PaginationParams & {
  type?: string;
};

export type GetMeExhibitsLikeResponse = (Like & {
  creation: ExploreCreation;
})[];

export type GetMeExhibitsFollowParams = PaginationParams & {
  role?: string;
};

export type GetMeExhibitsFollowResponse = (Omit<Follow, 'followee'> & {
  followee: ExploreUser;
})[];
