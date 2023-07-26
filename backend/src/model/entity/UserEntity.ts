import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';

export type User = {
  id: string;
  email: string;
  username: string;
  role: string | null;
  age: number | null;
  language: string | null;
  bio: string | null;
  tag: string | null;
  facebook: string | null;
  instagram: string | null;
  youtube: string | null;
  soundcloud: string | null;
  lastProjectId: string | null;
  connectionId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

@Entity({ name: 'user' })
export class UserEntity implements User {
  @Column({ primary: true })
  id!: string;

  @Column({ type: 'varchar' })
  email!: string;

  @Column({ type: 'varchar' })
  username!: string;

  @Column({ type: 'varchar' })
  role: string | null = null;

  @Column({ type: 'int' })
  age: number | null = null;

  @Column({ type: 'varchar' })
  language: string | null = null;

  @Column({ type: 'varchar' })
  bio: string | null = null;

  @Column({ type: 'varchar' })
  tag: string | null = null;

  @Column({ type: 'varchar' })
  facebook: string | null = null;

  @Column({ type: 'varchar' })
  instagram: string | null = null;

  @Column({ type: 'varchar' })
  youtube: string | null = null;

  @Column({ type: 'varchar' })
  soundcloud: string | null = null;

  @Column({ type: 'uuid', name: 'last_project_id', default: null })
  lastProjectId: string | null = null;

  @Column({ type: 'varchar', name: 'connection_id', default: null })
  connectionId: string | null = null;

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
