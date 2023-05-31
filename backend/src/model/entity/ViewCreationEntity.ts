import { ViewColumn, ViewEntity } from 'typeorm';
import { Type } from 'src/constant/Creation';
import { Status } from 'src/constant/Project';
import { booleanTransformer } from 'src/util/typeorm';

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
  username: string;
  projectStatus: Status;
  projectCreatedAt: string | null;
  projectUpdatedAt: string | null;
};

@ViewEntity({ name: 'v_creation' })
export class ViewCreationEntity implements ViewCreation {
  @ViewColumn()
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

  @ViewColumn()
  lyrics: string | null = null;

  @ViewColumn({ name: 'project_id' })
  projectId!: string;

  @ViewColumn({ name: 'is_original', transformer: booleanTransformer })
  isOriginal!: boolean;

  @ViewColumn({ name: 'inspired_id' })
  inspiredId: string | null = null;

  @ViewColumn({
    transformer: booleanTransformer,
  })
  approval: boolean | null = null;

  @ViewColumn({ name: 'created_at' })
  createdAt: string | null = null;

  @ViewColumn({ name: 'updated_at' })
  updatedAt: string | null = null;

  @ViewColumn()
  username!: string;

  @ViewColumn({ name: 'project_status' })
  projectStatus!: Status;

  @ViewColumn({ name: 'project_created_at' })
  projectCreatedAt: string | null = null;

  @ViewColumn({ name: 'updated_at' })
  projectUpdatedAt: string | null = null;
}
