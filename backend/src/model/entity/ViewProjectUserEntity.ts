import { ViewColumn, ViewEntity } from 'typeorm';
import { Status } from 'src/constant/Project';
import { ViewProjectUser } from './ViewProjectUser';

@ViewEntity({ name: 'v_project_user' })
export class ViewProjectUserEntity implements ViewProjectUser {
  @ViewColumn()
  id!: string;

  @ViewColumn({ name: 'user_id' })
  userId!: string;

  @ViewColumn({ name: 'project_id' })
  projectId!: string;

  @ViewColumn()
  status!: Status;

  @ViewColumn({ name: 'created_at' })
  createdAt: string | null = null;

  @ViewColumn({ name: 'updated_at' })
  updatedAt: string | null = null;
}
