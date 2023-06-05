import { BeforeInsert, BeforeUpdate, Column, Entity, Generated } from 'typeorm';

export type LyricsHistory = {
  id: string;
  lyricsId: string;
  content: string;
  createdAt: string | null;
  updatedAt: string | null;
};

@Entity({ name: 'lyrics_history' })
export class LyricsHistoryEntity implements LyricsHistory {
  @Column({ primary: true })
  @Generated('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'lyrics_id' })
  lyricsId!: string;

  @Column({ type: 'varchar' })
  content!: string;

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
