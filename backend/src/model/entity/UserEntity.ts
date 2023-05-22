import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { User } from './User';

@Entity({ name: 'user' })
export class UserEntity implements User {
  @Column({ primary: true })
  id!: string;

  @Column({ type: 'varchar' })
  username!: string;

  @Column({ type: 'uuid', name: 'last_project_id', default: null })
  lastProjectId: string | null = null;

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
