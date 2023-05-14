import { BeforeInsert, BeforeUpdate, Column, Entity, Generated } from 'typeorm';
import { Project } from './Project';

@Entity({ name: 'project' })
export class ProjectEntity implements Project {
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

  @Column({ type: 'timestamp', name: 'created_at', default: null })
  createdAt!: string;

  @Column({ type: 'timestamp', name: 'updated_at', default: null })
  updatedAt: string | null = null;

  @Column({ type: 'timestamp', name: 'last_viewed_at', default: null })
  lastViewedAt: string | null = null;

  @BeforeInsert()
  setDateCreated(): void {
    this.createdAt = new Date().toISOString();
    this.lastViewedAt = new Date().toISOString();
  }

  @BeforeUpdate()
  setDateUpdated(): void {
    this.updatedAt = new Date().toISOString();
    this.lastViewedAt = new Date().toISOString();
  }
}
