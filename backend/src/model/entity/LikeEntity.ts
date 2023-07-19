import { BeforeInsert, BeforeUpdate, Column, Entity, Generated } from 'typeorm';

export type Like = {
  id: string;
  userId: string;
  creationId: string;
  createdAt: string | null;
  updatedAt: string | null;
};

@Entity({ name: 'like' })
export class LikeEntity implements Like {
  @Column({ primary: true })
  @Generated('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @Column({ type: 'uuid', name: 'creation_id' })
  creationId!: string;

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
