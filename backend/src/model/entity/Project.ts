export type Project = {
  id: string;
  userId: string;
  status: string;
  name: string;
  description: string;
  theme: string;
  genre: string;
  language: string;
  caption: string;
  coverFileUri: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  lastViewedAt: string | null;
};
