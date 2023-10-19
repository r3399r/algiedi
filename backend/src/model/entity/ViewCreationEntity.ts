import {
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  ViewColumn,
  ViewEntity,
} from 'typeorm';
import { Type } from 'src/model/constant/Creation';
import { Info, InfoEntity } from './InfoEntity';
import { Project, ProjectEntity } from './ProjectEntity';
import { User, UserEntity } from './UserEntity';

export type ViewCreation = {
  id: string;
  type: Type;
  userId: string | null;
  user: User | null;
  infoId: string;
  info: Info;
  projectId: string | null;
  project: Project | null;
  inspiredId: string | null;
  fileUri: string | null;
  tabFileUri: string | null;
  lyricsText: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

@ViewEntity({ name: 'v_creation' })
export class ViewCreationEntity implements ViewCreation {
  @ViewColumn()
  @PrimaryColumn()
  id!: string;

  @ViewColumn()
  type!: Type;

  @ViewColumn({ name: 'user_id' })
  userId: string | null = null;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: User | null = null;

  @ViewColumn({ name: 'info_id' })
  infoId!: string;

  @ManyToOne(() => InfoEntity)
  @JoinColumn({ name: 'info_id' })
  info!: Info;

  @ViewColumn({ name: 'project_id' })
  projectId: string | null = null;

  @ManyToOne(() => ProjectEntity)
  @JoinColumn({ name: 'project_id' })
  project: Project | null = null;

  @ViewColumn({ name: 'inspired_id' })
  inspiredId: string | null = null;

  @ViewColumn({ name: 'file_uri' })
  fileUri: string | null = null;

  @ViewColumn({ name: 'tab_file_uri' })
  tabFileUri: string | null = null;

  @ViewColumn({ name: 'lyrics_text' })
  lyricsText: string | null = null;

  @ViewColumn({ name: 'created_at' })
  createdAt: string | null = null;

  @ViewColumn({ name: 'updated_at' })
  updatedAt: string | null = null;
}
