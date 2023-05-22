import { Project } from 'src/model/entity/Project';

type UploadCommon = {
  name: string;
  description: string;
  theme: string;
  genre: string;
  language: string;
  caption: string;
  coverFile: string | null;
  isOriginal: 0 | 1;
  inspiredId: string | null;
};

export type UploadTrack = UploadCommon & {
  type: 'track';
  file: string;
  tabFile: string | null;
};

export type UploadLyrics = UploadCommon & {
  type: 'lyrics';
  lyrics: string;
};
export type PostUploadRequest = UploadLyrics | UploadTrack;

export type PostUploadResponse = Project;
