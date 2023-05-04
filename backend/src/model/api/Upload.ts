type UploadCommon = {
  name: string;
  description: string;
  theme: string;
  genre: string;
  language: string;
  caption: string;
  coverFile: string | null;
  inspiredProjectId: string | null;
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
