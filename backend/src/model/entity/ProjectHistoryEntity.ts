import { BeforeInsert, BeforeUpdate, Column, Entity, Generated } from 'typeorm';

export type ProjectHistory = {
  id: string;
  projectId: string;
  trackFileUri: string | null;
  tabFileUri: string | null;
  lyricsText: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

@Entity({ name: 'project_history' })
export class ProjectHistoryEntity implements ProjectHistory {
  @Column({ primary: true })
  @Generated('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'project_id' })
  projectId!: string;

  @Column({ type: 'varchar', name: 'track_file_uri', default: null })
  trackFileUri: string | null = null;

  @Column({ type: 'varchar', name: 'tab_file_uri', default: null })
  tabFileUri: string | null = null;

  @Column({ type: 'varchar', name: 'lyrics_text', default: null })
  lyricsText: string | null = null;

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
