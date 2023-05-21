import { BeforeInsert, BeforeUpdate, Column, Entity, Generated } from 'typeorm';
import { Lyrics } from './Lyrics';

@Entity({ name: 'lyrics' })
export class LyricsEntity implements Lyrics {
  @Column({ primary: true })
  @Generated('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  lyrics!: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @Column({ type: 'uuid', name: 'project_id' })
  projectId!: string;

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
