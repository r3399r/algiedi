import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { NotificationType } from 'src/model/constant/Notification';
import { User, UserEntity } from './UserEntity';

export type Notification = {
  id: string;
  toUserId: string;
  toUser: User;
  isRead: boolean;
  type: NotificationType;
  fromUserId: string;
  fromUser: User;
  targetId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

@Entity({ name: 'notification' })
export class NotificationEntity implements Notification {
  @Column({ primary: true })
  @Generated('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'to_user_id' })
  toUserId!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'to_user_id' })
  toUser!: User;

  @Column({ type: 'boolean', name: 'is_read' })
  isRead!: boolean;

  @Column({ type: 'varchar' })
  type!: NotificationType;

  @Column({ type: 'uuid', name: 'from_user_id' })
  fromUserId!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'from_user_id' })
  fromUser!: User;

  @Column({ type: 'uuid', name: 'target_id' })
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
