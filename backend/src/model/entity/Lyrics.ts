export type Lyrics = {
  id: string;
  userId: string;
  name: string;
  description: string;
  theme: string;
  genre: string;
  language: string;
  caption: string;
  coverFileUri: string | null;
  lyrics: string;
  projectId: string;
  isOriginal: boolean;
  inspiredId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};
