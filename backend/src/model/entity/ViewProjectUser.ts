import { Status } from 'src/constant/Project';

export type ViewProjectUser = {
  id: string;
  userId: string;
  projectId: string;
  status: Status;
  createdAt: string | null;
  updatedAt: string | null;
};
