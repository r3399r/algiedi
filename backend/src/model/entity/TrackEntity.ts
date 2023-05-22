import { BeforeInsert, BeforeUpdate, Column, Entity, Generated } from 'typeorm';
import { Track } from './Track';

@Entity({ name: 'track' })
export class TrackEntity implements Track {
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

  @Column({ type: 'varchar', name: 'file_uri' })
  fileUri!: string;

  @Column({ type: 'varchar', name: 'tab_file_uri', default: null })
  tabFileUri: string | null = null;

  @Column({ type: 'uuid', name: 'project_id' })
  projectId!: string;

  @Column({ type: 'boolean', name: 'is_original' })
  isOriginal!: 0 | 1;

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
