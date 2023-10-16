import { PrimaryColumn, ViewColumn, ViewEntity } from 'typeorm';
import { Type } from 'src/model/constant/Creation';
import { Status as ProjectStatus } from 'src/model/constant/Project';

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
  lyricsText: string | null;
  projectId: string;
  inspiredId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  username: string;
  projectStatus: ProjectStatus;
  projectStartedAt: string | null;
  projectCreatedAt: string | null;
  projectUpdatedAt: string | null;
};

@ViewEntity({ name: 'v_creation' })
export class ViewCreationEntity implements ViewCreation {
  @ViewColumn()
  @PrimaryColumn()
  id!: string;

  @ViewColumn()
  type!: Type;

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
  fileUri: string | null = null;

  @ViewColumn({ name: 'tab_file_uri' })
  tabFileUri: string | null = null;

  @ViewColumn({ name: 'lyrics_text' })
  lyricsText: string | null = null;

  @ViewColumn({ name: 'project_id' })
  projectId!: string;

  @ViewColumn({ name: 'inspired_id' })
  inspiredId: string | null = null;

  @ViewColumn({ name: 'created_at' })
  createdAt: string | null = null;

  @ViewColumn({ name: 'updated_at' })
  updatedAt: string | null = null;

  @ViewColumn()
  username!: string;

  @ViewColumn({ name: 'project_status' })
  projectStatus!: ProjectStatus;

  @ViewColumn({ name: 'project_started_at' })
  projectStartedAt: string | null = null;

  @ViewColumn({ name: 'project_created_at' })
  projectCreatedAt: string | null = null;

  @ViewColumn({ name: 'updated_at' })
  projectUpdatedAt: string | null = null;
}
