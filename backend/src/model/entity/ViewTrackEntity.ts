import { ViewColumn, ViewEntity } from 'typeorm';
import { ViewTrack } from './ViewTrack';

@ViewEntity({ name: 'v_track' })
export class ViewTrackEntity implements ViewTrack {
  @ViewColumn()
  id!: string;

  @ViewColumn({ name: 'user_id' })
  userId!: string;

  @ViewColumn()
  name!: string;

  @ViewColumn()
  description!: string;

  @ViewColumn()
  theme!: string;

  @ViewColumn()
  genre!: string;

  @ViewColumn()
  language!: string;

  @ViewColumn()
  caption!: string;

  @ViewColumn({ name: 'cover_file_uri' })
  coverFileUri: string | null = null;

  @ViewColumn({ name: 'file_uri' })
  fileUri!: string;

  @ViewColumn({ name: 'tab_file_uri' })
  tabFileUri: string | null = null;

  @ViewColumn({ name: 'project_id' })
  projectId!: string;

  @ViewColumn({ name: 'is_original' })
  isOriginal!: 0 | 1;

  @ViewColumn({ name: 'inspired_id' })
  inspiredId: string | null = null;

  @ViewColumn({ name: 'created_at' })
  createdAt: string | null = null;

  @ViewColumn({ name: 'updated_at' })
  updatedAt: string | null = null;

  @ViewColumn({ name: 'username' })
  username!: string;
}
