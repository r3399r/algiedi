import { BeforeInsert, BeforeUpdate, Column, Entity, Generated } from 'typeorm';

export type Song = {
  id: string;
  userId: string;
  name: string;
  description: string;
  theme: string;
  genre: string;
  language: string;
  caption: string;
  coverFileUri: string | null;
  projectId: string;
  fileUri: string;
  inspiredId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

@Entity({ name: 'song' })
export class SongEntity implements Song {
  @Column({ primary: true })
  @Generated('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  description!: string;

  @Column({ type: 'varchar' })
  theme!: string;

  @Column({ type: 'varchar' })
  genre!: string;

  @Column({ type: 'varchar' })
  language!: string;

  @Column({ type: 'varchar' })
  caption!: string;

  @Column({ type: 'varchar', name: 'cover_file_uri', default: null })
  coverFileUri: string | null = null;

  @Column({ type: 'uuid', name: 'project_id' })
  projectId!: string;

  @Column({ type: 'varchar', name: 'file_uri' })
  fileUri!: string;

  @Column({ type: 'uuid', name: 'inspired_id', default: null })
  inspiredId: string | null = null;

  @Column({ type: 'timestamp', name: 'created_at', default: null })
  createdAt!: string;

  @Column({ type: 'timestamp', name: 'updated_at', default: null })
  updatedAt: string | null = null;

  @BeforeInsert()
  setDateCreated(): void {
    this.createdAt = new Date().toISOString();
  }

  @BeforeUpdate()
  setDateUpdated(): void {
    this.updatedAt = new Date().toISOString();
  }
}
