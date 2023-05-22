import { Status } from 'src/constant/Project';

export type Project = {
  id: string;
  status: Status;
  createdAt: string | null;
  updatedAt: string | null;
};
