import { Type } from 'src/model/constant/Creation';

export type ViewCreation = {
  id: string;
  type: Type;
  userId: string;
  name: string;
  description: string;
  theme: string;
  genre: string;
  language: string;
  caption: string;
  coverFileUri: string | null;
  fileUri: string | null;
  tabFileUri: string | null;
  lyrics: string | null;
  projectId: string;
  isOriginal: boolean;
  inspiredId: string | null;
  approval: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
};
