export type Track = {
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
  isOriginal: boolean;
  inspiredId: string | null;
  approval: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
};
