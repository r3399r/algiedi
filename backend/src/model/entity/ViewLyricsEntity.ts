import { ViewColumn, ViewEntity } from 'typeorm';
import { booleanTransformer } from 'src/util/typeorm';
import { ViewLyrics } from './ViewLyrics';

@ViewEntity({ name: 'v_lyrics' })
export class ViewLyricsEntity implements ViewLyrics {
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

  @ViewColumn()
  lyrics!: string;

  @ViewColumn({ name: 'project_id' })
  projectId!: string;

  @ViewColumn({
    name: 'is_original',
    transformer: booleanTransformer,
  })
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

  @ViewColumn({ name: 'username' })
  username!: string;
}
