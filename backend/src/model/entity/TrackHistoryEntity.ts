import { BeforeInsert, BeforeUpdate, Column, Entity, Generated } from 'typeorm';

export type TrackHistory = {
  id: string;
  trackId: string;
  fileUri: string;
  tabFileUri: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

@Entity({ name: 'track_history' })
export class TrackHistoryEntity implements TrackHistory {
  @Column({ primary: true })
  @Generated('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'track_id' })
  trackId!: string;

  @Column({ type: 'varchar', name: 'file_uri' })
  fileUri!: string;

  @Column({ type: 'varchar', name: 'tab_file_uri', default: null })
  tabFileUri: string | null = null;

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
