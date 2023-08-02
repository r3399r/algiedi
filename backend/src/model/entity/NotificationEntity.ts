import { BeforeInsert, BeforeUpdate, Column, Entity, Generated } from 'typeorm';

export enum Type {
  ProjectStart = 'project-start',
  ProjectReject = 'project-reject',
}

export type Notification = {
  id: string;
  userId: string;
  isRead: boolean;
  type: Type;
  targetId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

@Entity({ name: 'notification' })
export class NotificationEntity implements Notification {
  @Column({ primary: true })
  @Generated('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @Column({ type: 'boolean', name: 'is_read' })
  isRead!: boolean;

  @Column({ type: 'varchar' })
  type!: Type;

  @Column({ type: 'uuid', name: 'target_id', default: null })
  targetId!: string | null;

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
