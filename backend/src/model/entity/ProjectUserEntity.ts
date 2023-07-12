import { BeforeInsert, BeforeUpdate, Column, Entity, Generated } from 'typeorm';
import { Role } from 'src/model/constant/Project';

export type ProjectUser = {
  id: string;
  projectId: string;
  userId: string;
  lyricsId: string | null;
  trackId: string | null;
  role: Role;
  isAccepted: boolean | null;
  isReady: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
};

@Entity({ name: 'project_user' })
export class ProjectUserEntity implements ProjectUser {
  @Column({ primary: true })
  @Generated('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'project_id' })
  projectId!: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @Column({ type: 'uuid', name: 'lyrics_id', default: null })
  lyricsId: string | null = null;

  @Column({ type: 'uuid', name: 'track_id', default: null })
  trackId: string | null = null;

  @Column({ type: 'varchar' })
  role!: Role;

  @Column({ type: 'boolean', name: 'is_accepted', default: null })
  isAccepted: boolean | null = null;

  @Column({ type: 'boolean', name: 'is_ready', default: null })
  isReady: boolean | null = null;

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
