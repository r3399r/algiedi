export type UploadCommon = {
  name: string;
  description: string;
  theme: string;
  genre: string;
  language: string;
  caption: string;
  coverFile: string | null;
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

export type PutUploadIdRequest =
  | {
      type: 'track';
      file: string;
      tabFile: string | null;
    }
  | {
      type: 'lyrics';
      lyrics: string;
    }
  | {
      type: 'song';
      file: string | null;
      tabFile: string | null;
      lyrics?: string;
    };
