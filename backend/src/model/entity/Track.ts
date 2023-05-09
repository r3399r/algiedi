export type Track = {
  id: string;
  userId: string;
  fileUri: string;
  tabFileUri: string | null;
  projectId: string;
  inspiredProjectId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};
