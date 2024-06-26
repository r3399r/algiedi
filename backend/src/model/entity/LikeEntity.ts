import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Type } from 'src/model/constant/Creation';
import { User, UserEntity } from './UserEntity';

export type Like = {
  id: string;
  userId: string;
  user: User;
  creationId: string;
  type: Type;
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

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'uuid', name: 'creation_id' })
  creationId!: string;

  @Column({ type: 'float' })
  type!: Type;

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
