import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User, UserEntity } from './UserEntity';

export type Follow = {
  id: string;
  followerId: string;
  follower: User;
  followeeId: string;
  followee: User;
  createdAt: string | null;
  updatedAt: string | null;
};

@Entity({ name: 'follow' })
export class FollowEntity implements Follow {
  @Column({ primary: true })
  @Generated('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'follower_id' })
  followerId!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'follower_id' })
  follower!: User;

  @Column({ type: 'uuid', name: 'followee_id' })
  followeeId!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'followee_id' })
  followee!: User;

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
