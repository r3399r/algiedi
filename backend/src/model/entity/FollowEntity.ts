import { BeforeInsert, BeforeUpdate, Column, Entity, Generated } from 'typeorm';

export type Follow = {
  id: string;
  followerId: string;
  followeeId: string;
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

  @Column({ type: 'uuid', name: 'followee_id' })
  followeeId!: string;

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
