import { BeforeInsert, BeforeUpdate, Column, Entity, Generated } from 'typeorm';

export type Chat = {
  id: string;
  userId: string;
  projectId: string;
  content: string;
  createdAt: string | null;
  updatedAt: string | null;
};

@Entity({ name: 'chat' })
export class ChatEntity implements Chat {
  @Column({ primary: true })
  @Generated('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @Column({ type: 'uuid', name: 'project_id' })
  projectId!: string;

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
