export type ViewTrack = {
  id: string;
  userId: string;
  name: string;
  description: string;
  theme: string;
  genre: string;
  language: string;
  caption: string;
  coverFileUri: string | null;
  fileUri: string;
  tabFileUri: string | null;
  projectId: string;
  isOriginal: 0 | 1;
  inspiredId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  username: string;
};
